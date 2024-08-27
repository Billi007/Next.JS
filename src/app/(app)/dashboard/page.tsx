'use client'
import React, { useCallback, useEffect, useState } from 'react'
import MessageCard from '@/components/MessageCard'
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from '@/models/user.model'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessagesSchema } from '@/schema/acceptMessageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/APIresponse'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchIsLoading] = useState(false);
  const {toast} = useToast();

  const handleDeleteMessage = (messageId: string) => {
  setMessages(messages.filter((message) => message._id !== messageId ))
  }

  const {data: session} = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema)
  })

  const {register, watch, setValue} = form;
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {     //useCallback need callbach obviously
   setIsSwitchIsLoading(true)
   
   try {
    const response = await axios.get<ApiResponse>('/api/accept-messages');
    setValue('accept-messages', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data?.message || 'Failed to fetch message settings',
        variant: "destructive"
      })
    } finally {
      setIsSwitchIsLoading(false);
    }
  },[setValue, toast])


    const fecthMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchIsLoading(false)

    try {
     const response = await axios.get<ApiResponse>('/api/get-messages');
     setMessages(response.data.messages || []);
     if(refresh){
       toast({
        title: 'Refreshed messages',
        description: 'Showing latest messages',
      })
     }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data?.message || 'Failed to fetch message settings',
        variant: "destructive"
      })
    }finally {
      setIsLoading(false)
      setIsSwitchIsLoading(false);
    }
    },[setIsLoading, setMessages, toast]);

    useEffect(() => {
      if(!session || !session.user) return;
      fecthMessages();  //first fetch messages on page load
      fetchAcceptMessage();
    },[session, setValue, fecthMessages, fetchAcceptMessage])


    //handle switch change 
    const handleSwitchChange = async () => {
      try {
        const response = await axios.post<ApiResponse>('/api/accept-messages', {
         acceptMessages: !acceptMessages,
        })
        setValue('accept-messages', !acceptMessages)
        toast({
          title: response.data.message,
          variant: 'default'
        })
      } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data?.message || 'Failed to fetch message settings',
        variant: "destructive"
      })
      }};
      
      if(!session || !session.user){
        return <div>Please login.</div>
      }
      const {username} = session?.user as User
      //TODO do more research here
      const baseUrl = `${window.location.protocol}//${window.location.host}`
      const profileUrl = `${baseUrl}/u/${username}`

      const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
          title: 'Link copied to clipboard',
          variant: 'default'
        })
      }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}/>

      <span className="ml-2">
        Accept Messages: {acceptMessages ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
      e.preventDefault();
      fecthMessages(true);}}>
        
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard
            key={message._id}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  </div>
  );
}


export default Dashboard