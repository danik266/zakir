import React from 'react'
import Image from 'next/image'
import logo from '../../../public/logo.svg'
import lupa from '../../../public/image 1.png'
import carta from '../../../public/карта.png'
import plus from '../../../public/118934_file_512x512.png'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Card from '../Card/Card'

const Advant = () => {
  return (
    <>
    <div className="mt-45 bg-amber-50 h-[100vh]">
      <h2 className='text-6xl text-center text-[#48887B] mb-30'>Преимущества</h2>
      <div className="flex justify-center gap-15">
        <Card
          img={lupa}
          title='Поиск людей'
          text='Введите имя, дату рождения или другие данные — наш 
          сервис поможет найти 
          человека.'
          />
        <Card
          img={carta}
          title='Карта захоронений'
          text='Находите место захоронения на карте. 
          Удобно планировать посещения и поддерживать могилу в порядке.'
          />
          <Card
          img={plus}
          title='Добавление страниц '
          text='Добавление информации о человеке: имя, даты жизни, фотографии и место захоронения.'

          />
          
      </div>
    </div>
    </>
  )
}

export default Advant