"use client"
import React from 'react'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import zakir from '../../../public/Безымянный-2.svg'
import {useRouter} from 'next/navigation'
const Main = () => {
  const router = useRouter()
  return (
    <>
        <div className="bg-[#48887B] bg-gradient-to-br from-[#506a65] via-[#649d92] to-[#adddd4]">
      <div className="w-full md:w-[600px] mx-auto flex flex-col items-center gap-10 py-50 text-white">
      <div className="flex flex-col items-center gap-10">
        <Image
          src={zakir}
          width={300}
          height={220}
          alt='Zakir'
          className='w-40 h-32 md:w-72 md:h-56'
          />
        <p className="md:text-xl text-2xl block text-center">Создайте пространство в честь близких, 
          делясь их историями и
           добрыми делами.
        Оставляйте воспоминания, фотографии и дуа, чтобы
         награда за них продолжалась.</p>
      </div>
      <div className="flex gap-3">
              <Button  
                onClick={()=>router.push('/sign-up')}
                className='hover:bg-[#48887B] hover:border hover:border-white hover:text-white p-5 bg-white text-[#48887B]'>Начать</Button>
      </div>
    </div>

    </div>
    </>
  )
}

export default Main



