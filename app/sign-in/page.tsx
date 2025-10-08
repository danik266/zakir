"use client";

import React, { useState, useEffect } from "react";
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
import google from "../../public/One-Source-FB-2-1.png";
import frame from "../../public/Frame 1 (1).png";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const errorMessages: Record<string, string> = {
    "Invalid login credentials": "Неверные учетные данные для входа",
    "Email not confirmed": "Email не подтвержден",
  };

  const translateError = (msg: string) =>
    errorMessages[msg] || "Произошла ошибка";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else {
      setIsOpen(true);
      setTimeout(() => router.push("/"), 2500);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://zakir-ten.vercel.app/dashboard" },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9f8] to-[#d6e8e3] flex flex-col md:flex-row justify-center items-center px-4 py-10 md:py-0 gap-8 md:gap-20">
      {/* Левая часть (форма) */}
      <Card className="w-full max-w-[400px] md:max-w-[500px] border-none shadow-lg rounded-2xl bg-white">
        <CardHeader className="text-center">
          <Image
            className="mx-auto mb-4"
            width={90}
            height={60}
            alt="zakir"
            src={zakir}
          />
          <CardTitle className="text-2xl md:text-3xl font-semibold">
            Добро пожаловать!
          </CardTitle>
          <CardDescription className="text-[#48887B] text-sm md:text-base">
            Введите ваши учетные данные для входа
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label className="text-[#48887B]" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none bg-gray-100 placeholder:font-medium"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label className="text-[#48887B]" htmlFor="password">
                  Пароль
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#48887B] hover:underline"
                >
                  Забыли пароль?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none bg-gray-100 placeholder:font-medium"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{translateError(error)}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#48887B] hover:bg-[#3c685f] text-white font-medium mt-4"
            >
              Войти
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-5 text-center">
          <span className="text-sm">Или продолжить с</span>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <Image src={google} alt="google" width={24} height={24} />
            Google
          </Button>
          <span className="text-sm">
            Нет аккаунта?
            <Link
              href="/sign-up"
              className="text-[#48887B] hover:text-black ml-1 font-medium"
            >
              Регистрация
            </Link>
          </span>
        </CardFooter>
      </Card>

      {/* Правая часть (картинка) */}
      <div className="hidden md:flex">
        <Image
          src={frame}
          width={500}
          height={700}
          alt="Frame"
          className="object-contain"
          priority
        />
      </div>

      {/* Попап при успешном входе */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/30">
          <div className="bg-white rounded-xl p-6 w-80 shadow-2xl text-center">
            <p className="text-lg font-medium text-[#48887B]">Успешный вход!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
