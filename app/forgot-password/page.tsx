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

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://zakir-ten.vercel.app/update-password", 
    });

    if (error) {
      alert("Ошибка: " + error.message);
    } 
    else {
      alert("Ссылка для восстановления отправлена на почту!");
    }
  }

  return (
    <>
      <div className="border-none flex justify-center items-center gap-40">
        <Card className="w-full border-none max-w-[500px] h-[380px]">
          <CardHeader>
            <Image className="mb-5" width={100} height={70} alt="zakir" src={zakir} />
            <CardTitle>
              <h1 className="text-3xl">Восстановление пароля</h1>
            </CardTitle>
            <CardDescription>
              <p className="text-[15px] text-[#48887B]">
                Введите email, на который мы отправим ссылку для сброса пароля
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label className="text-[#48887B]" htmlFor="email">
                    Email пользователя
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Введите email"
                    className="border-none bg-gray-100 placeholder:font-semibold placeholder:text-[15px]"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="cursor-pointer w-full bg-[#48887B] hover:bg-[#3c685f]"
                >
                  Отправить
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-6">
            <div className="flex gap-2">
              <span className="text-gray-400">Вернуться к</span>
              <Link href="/sign-in">Авторизации</Link>
            </div>
          </CardFooter>
        </Card>

        <Image
          className="relative left-[7%] bottom-[50px]"
          src={frame}
          width={550}
          alt="Frame"
          height={800}
        />
      </div>
    </>
  );
};

export default ForgotPassword;


