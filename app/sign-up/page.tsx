"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import zakir from '../../public/Безымянный-1.svg'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import frame from '../../public/Frame 1 (1).png'
import { supabase } from '@/lib/supabaseClient'

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null) 

    if (form.password !== form.confirm) {
      setError("Пароли не совпадают") 
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          display_name: form.name,
        },
      },
    });
    setLoading(false)
    if (error) {
      setError("Ошибка: " + error.message)
    } else {
      setError(null)
      setIsOpen(true);
      console.log(data)
    }
  }
  useEffect(() => {
     let timer: NodeJS.Timeout
     if (isOpen) {
       timer = setTimeout(() => {
         setIsOpen(false)
         router.push("/sign-in")
       }, 5000)
     }
     return () => clearTimeout(timer)
   }, [isOpen, router])

    

  return (
    <div className="border-none flex justify-center items-center gap-30">
      <Card className="w-full border-none max-w-[500px] h-[650px]">
        <CardHeader>
          <Image className='mb-5' width={100} height={70} alt='zakir' src={zakir}/>
          <CardTitle>
            <h1 className='text-3xl'>Добро пожаловать!</h1>
          </CardTitle>
          <CardDescription>
            <p className='text-[15px] text-[#48887B]'>Пожалуйста, введите ваши данные для регистрации</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label className='text-[#48887B]' htmlFor="name">Имя пользователя</Label>
              <Input id="name" type="text" placeholder="Введите имя"
                className='border-none bg-gray-100 placeholder:font-semibold placeholder:text-[15px]'
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label className='text-[#48887B]' htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Введите email"
                className='border-none bg-gray-100 placeholder:font-semibold placeholder:text-[15px]'
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label className='text-[#48887B]' htmlFor="password">Пароль</Label>
              <Input id="password" type="password" placeholder="Введите пароль"
                className='border-none bg-gray-100 placeholder:font-semibold placeholder:text-[15px]'
                value={form.password} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label className='text-[#48887B]' htmlFor="confirm">Подтвердите пароль</Label>
              <Input id="confirm" type="password" placeholder="Введите пароль еще раз"
                className='border-none bg-gray-100 placeholder:font-semibold placeholder:text-[15px]'
                value={form.confirm} onChange={handleChange} required />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button disabled={loading} type="submit" className="cursor-pointer w-full bg-[#48887B] hover:bg-[#3c685f]">
              {loading ? "Загрузка..." : "Зарегистрироваться"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-6">
          <span className='text-[15px] w-[170px]'> Уже есть аккаунт?
            <Link href='/sign-in' className='text-[#48887B] hover:text-black'> Войти</Link>
          </span>
        </CardFooter>
      </Card>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] items-baseline flex justify-end bg-opacity-50 m-5">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl ">
            <p>Регистрация успешна! Проверь почту для подтверждения.</p>
          </div>
        </div>
      )}
      <Image className='relative left-[7%] bottom-[50px]' src={frame} width={550} alt='Frame'/>
    </div>
  )
}

export default SignUp
