"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.svg";
import zakir from "../../../public/Безымянный-1.svg";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full z-10 bg-white fixed px-5 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image width={50} height={50} alt="Logo" src={logo} />
          <Image width={100} height={50} alt="Zakir" src={zakir} />
        </div>
        <div className="hidden md:flex gap-4 items-center">
          <Link
            href="/dashboard/donate"
            className="border border-[#48887B] bg-[#48887B] text-white px-6 py-2 rounded transition-all hover:bg-[#5cae9e]"
          >
            Пожертвовать
          </Link>
          <Link
            href="/sign-in"
            className="border border-[#48887B] bg-white text-[#48887B] px-6 py-2 rounded transition-all hover:bg-[#48887B] hover:text-white"
          >
            Войти
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2 px- pt-5">
          <Link
            href="/dashboard/donate"
            className="border border-[#48887B] bg-[#48887B] text-white px-4 py-2 rounded transition-all hover:bg-[#5cae9e]"
            onClick={() => setIsOpen(false)}
          >
            Пожертвовать
          </Link>
          <Link
            href="/sign-in"
            className="border border-[#48887B] bg-white text-[#48887B] px-4 py-2 rounded transition-all hover:bg-[#48887B] hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Войти
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
