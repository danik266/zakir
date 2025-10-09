import React from 'react'
import Image, { StaticImageData } from 'next/image'

interface Props {
  img: StaticImageData,
  title: string,
  text: string
}

const Card = ({ img, title, text }: Props) => {
  return (
    <div className="w-[74%] bg-white p-8 h-[400px] flex flex-col gap-5 items-center
      px-10 py-15 md:text-center md:w-[23%] md:h-[400px] md:px-6 md:py-8
      transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl rounded-xl shadow-md">
      
      <Image
        src={img}
        height={80}
        width={80}
        alt={title}
      />
      <h3 className="text-xl font-bold block md:text-lg">{title}</h3>
      <p className="block text-[16px] text-[#48887B] md:text-[14px]">{text}</p>
    </div>
  )
}

export default Card