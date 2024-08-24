'use client'
/* eslint-disable react-hooks/rules-of-hooks */
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signInSchema } from '@/schema/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'



const page = () => {
const {toast} = useToast();
const router = useRouter();

const form = useForm<z.infer<typeof signInSchema>>({                    //form is also called REGISTER
  resolver: zodResolver(signInSchema),
  defaultValues: {
    email: " ",
    password: " ",
  }     
}); 

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
     const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
     })

     if(result?.error){
     toast({
      title: "Login failed",
      description:"Incorrect username or password",
      variant: "destructive"
     })
    }
      if(result?.url){
      router.replace('/')
    }
    else{
      toast({
        title: "Login successful",
        description:"Welcome back!",
        variant: "destructive"
      })
    }
  }
 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join Mystery message
        </h1>
        <p className="mb-4">Sign in to continue your secret conversations</p>
      </div>

    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

      <FormField
      control={form.control}
      name='email'
      render={({ field }) => (
      <FormItem>
      <FormLabel>Username/Email</FormLabel>
      <FormControl>
        <Input required  placeholder="enter email or username"  {...field}/>
      </FormControl>
      <FormMessage />
      </FormItem>
  )}/>

      <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
      <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <Input required  type="password" {...field} />
      </FormControl>
      <FormMessage />
      </FormItem>
  )}/>
       <Button type="submit"  className='w-full'> Signin </Button>
       </form>
     </Form>

      <div className="text-center mt-4">
        <p>
          Not a member yet?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default page