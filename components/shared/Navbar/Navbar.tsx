import React from 'react'
import Image from 'next/image'
import logo from '../../../public/logo.svg'
import Link from 'next/link'
import zakir from '../../../public/Безымянный-1.svg'

import { Button } from '@/components/ui/button'

const Navbar = () => {
    return (
    <>
    <div className="w-[100%] z-1 bg-white fixed px-10 p-5 mx-auto flex justify-between items-center pt-5 shadow-md">
        <div className="flex items-center gap-2">
            <Image
            className='md:w-20 md:h-20'
                width={70}
                height={70}
                alt='Zakir'
                src={logo}
                />
                <span>
                    <Image
                        className=''
                        width={100}
                        height={70}
                        alt='zakir'
                        src={zakir}/>
                </span>
        </div>
        <div className="">
            <Link 
            href='/sign-in'
            className='border border-[#48887B]
             bg-white text-[#48887B]
             px-9 rounded transition-all py-3 hover:bg-[#48887B] hover:text-white'>Войти</Link>
        </div>
    </div>
    </>
  )
}

export default Navbar