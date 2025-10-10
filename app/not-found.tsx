import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import img from '../public/images/12657875.png'
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-6xl font-bold text-[#48887B] mb-4">404</h1>
        <div className="relative w-64 h-64 mx-auto mb-8">
            <Image 
          src={img}
          alt="Узор" 
          width={350}
          height={350}
        />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Страница не найдена
        </h2>
        <p className="text-gray-600 mb-8">
          Извините, но страница, которую вы ищете, не существует или была перемещена.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-[#48887B] text-white px-6 py-3 rounded-lg 
                     hover:bg-[#3a6c62] transition-colors duration-300 
                     shadow-lg hover:shadow-xl"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}

export default NotFound