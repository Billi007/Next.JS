'use client'
import React from 'react'
import messages from '@/messages.json'
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'

const Home = () => {
  return (
   <>
   <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
    <section  className="text-center mb-8 md:mb-12">
    <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
      </h1>
       <p className="mt-3 md:mt-4 text-base md:text-lg">
         True Feedback - Where your identity remains a secret.
      </p>
    </section>

    <Carousel
    plugins={[Autoplay({delay: 3000})]}
      opts={{
        align: "start",
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 8 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
   </main>
   </>
  )
}

export default Home