/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from 'react'
import {Card,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card"
import {AlertDialog,AlertDialogAction, AlertDialogCancel,AlertDialogContent, AlertDialogDescription,AlertDialogFooter, AlertDialogHeader,AlertDialogTitle,
AlertDialogTrigger,} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react';
import { Message } from '@/models/user.model'
import { useToast } from './ui/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/APIresponse'
  
type messageCardProps = {
message: Message,
onMessageDelete: (messageId: string) => void
}

const MessageCard = ({message, onMessageDelete}: messageCardProps) => {

const {toast} = useToast();
const handleDeleteConfirm = async () => {
const result = await axios.delete<ApiResponse>(`api/delete-message/${message._id}`);
toast({
    title: result.data.message,
    description: 'Your message has been successfully deleted.',
})
onMessageDelete(message._id as string);

}

  return (
    <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline"><X className="w-5 h-5"> </X> </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <CardDescription>Card Description</CardDescription>
  </CardHeader>
</Card>

  )
}

export default MessageCard