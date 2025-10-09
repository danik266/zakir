"use client";

import React, { useState } from "react";
import zakir from "../../public/Безымянный-1.svg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import frame from "../../public/Frame 1 (1).png";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://zakir-ten.vercel.app/update-password",
    });

    if (error) {
      setModalMessage("Ошибка: " + error.message);
    } else {
      setModalMessage("Ссылка для восстановления отправлена на почту!");
    }

    setIsOpen(true);
    setTimeout(() => setIsOpen(false), 3000);
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-8 md:gap-20 p-4 md:p-0 min-h-screen bg-gray-50">
      <Card className="w-full max-w-md md:max-w-[450px] p-6 md:p-10 shadow-lg rounded-xl flex-shrink-0">
        <CardHeader className="flex flex-col items-center">
          <Image className="mb-4" width={100} height={70} alt="zakir" src={zakir} />
          <CardTitle className="text-center text-2xl md:text-3xl font-semibold">
            Восстановление пароля
          </CardTitle>
          <CardDescription className="text-center text-sm md:text-base text-[#48887B] mt-2">
            Введите email, на который мы отправим ссылку для сброса пароля
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleReset}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-[#48887B]" htmlFor="email">
                  Email пользователя
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Введите email"
                  className="border-none bg-gray-100 placeholder:font-semibold placeholder:text-sm p-3 rounded-md"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#48887B] hover:bg-[#3c685f] text-white py-3 rounded-md"
              >
                Отправить
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-2">
          <div className="flex gap-1 text-sm md:text-base">
            <span className="text-gray-400">Вернуться к</span>
            <Link className="text-[#48887B]" href="/sign-in">
              Авторизации
            </Link>
          </div>
        </CardFooter>
      </Card>
<div className="w-full max-w-md md:max-w-[500px] flex justify-center md:justify-start mt-6 md:mt-0 hidden md:flex">
  <Image
    className="w-full h-auto object-contain"
    src={frame}
    alt="Frame"
    priority
  />
</div>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/30 px-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-xs shadow-2xl text-center">
            <p className="text-base md:text-lg font-medium text-[#48887B]">
              {modalMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
