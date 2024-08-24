/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios, {AxiosError} from 'axios'
import {useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schema/signUpSchema"
import { ApiResponse } from "@/types/APIresponse"
import { FormControl, FormField, FormItem, FormLabel, Form, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const page = () => {
  const [username, setUsername] = useState(" ");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(" ");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);  //300 = 300 milliseconds
  const {toast} = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({                    //form is also called REGISTER
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    }     
  });       

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(username){
        setIsCheckingUsername(true);
        setIsUsernameAvailable("")
        try {
         const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
         let message = response.data.message
         setIsUsernameAvailable(message);
         console.log(response)

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setIsUsernameAvailable(axiosError.response?.data.message ?? "Error checking username")
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique()
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
     const response = await axios.post<ApiResponse>('/api/sign-up', data);
     toast({
      title: 'Success',
      description: response.data.message,
     })
     router.replace(`/verify/${username}`,)
     setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signUp", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false);
        }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join Mystery message
        </h1>
        <p className="mb-4">Sign up to continue your secret conversations</p>
      </div>

    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

      <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
      <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input placeholder="username" required {...field}
        onChange={(e) => {
          field.onChange(e)
          debounced(e.target.value)
        }}
         />
      </FormControl>
      {!isCheckingUsername && isUsernameAvailable && (
                    <p
                      className={`text-sm ${
                        isUsernameAvailable === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {isUsernameAvailable}
                    </p>
                  )}
      <FormMessage />
      </FormItem>
  )}
 />

      <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
      <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" placeholder="email" required {...field}
         />
      </FormControl>
      <FormMessage />
      </FormItem>
  )}
 />
      <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
      <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <Input type="password" placeholder="password" required {...field}
         />
      </FormControl>
      <FormMessage />
      </FormItem>
  )}/>
       <Button type="submit"  className='w-full' disabled={isSubmitting}> Signup </Button>
       </form>
     </Form>

      <div className="text-center mt-4">
        <p>
          Not a member yet?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default page