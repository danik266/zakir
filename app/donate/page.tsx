"use client";
import React, { useState } from 'react'
import Navbaruser from "@/components/shared/Navbaruser/NavbarUser";

const DonatePage = () => {
  const [copied, setCopied] = useState(false)
  const [copiedcard, setCopiedCard] = useState(false)
  const telNumber = '+77770718277'
  const cardNumber = '4400 4303 5467 0421'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(telNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Не удалось скопировать:', err)
    }
  }

  const handleCopyCard = async () => {
    try {
      await navigator.clipboard.writeText(cardNumber)
      setCopiedCard(true)
      setTimeout(() => setCopiedCard(false), 2000)
    } catch (err) {
      console.error('Не удалось скопировать:', err)
    }
  }

  return (
    <>
    <Navbaruser />
    <div className="min-h-screen flex flex-col items-center justify-center  px-5">
      <h1 className="text-3xl font-bold mb-6">Пожертвования</h1>
      <p className="text-lg mb-4 text-center">
        Ваши пожертвования идут на развитие проекта и поддержку команды.
      </p>

      <div className="bg-white p-6 rounded shadow-md flex flex-col items-center gap-4">
        <p className="text-xl">Номер телефона Kaspi:</p>
        <p className="text-2xl font-mono">{telNumber}</p>

        <button
          onClick={handleCopy}
          className='bg-[#48887b] text-white px-6 py-3 rounded shadow-lg transition-all hover:bg-[#3b6e64] hover:scale-105'
        >
          {copied ? 'Скопировано!' : 'Скопировать номер телефона'}
        </button>
        <p className="text-xl">Номер карты Kaspi:</p>
        <p className="text-2xl font-mono">{cardNumber}</p>
        <button
          onClick={handleCopyCard}
          className='bg-[#48887b] text-white px-6 py-3 rounded shadow-lg transition-all hover:bg-[#3b6e64] hover:scale-105'
        >
          {copiedcard ? 'Скопировано!' : 'Скопировать номер карты'}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          После копирования, вставьте номер или карту в приложение Kaspi для перевода.
        </p>
      </div>
    </div>
    </>
  )
}

export default DonatePage
