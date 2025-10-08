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
    "Invalid login credentials": "Неверные учетные данные для входа в систему",
    "Email not confirmed": "Адрес электронной почты не подтвержден",
  };
  
  const translateError = (msg: string) =>
    errorMessages[msg] || "Произошла ошибка";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("Успешный вход:", data);
      setIsOpen(true);
    }
  };

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });

    if (error) {
      console.error("Google Auth error:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        setIsOpen(false);
        router.push("/");
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [isOpen, router]);

  return (
    <div className="border-none flex justify-center items-center gap-40">
      <Card className="w-full border-none max-w-[500px] h-[600px]">
        <CardHeader>
          <Image
            className="mb-5"
            width={100}
            height={70}
            alt="zakir"
            src={zakir}
          />
          <CardTitle>
            <h1 className="text-3xl">Добро пожаловать!</h1>
          </CardTitle>
          <CardDescription>
            <p className="text-[15px] text-[#48887B]">
              Пожалуйста, введите ваши учетные данные для входа!
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn}>
            <div className="flex flex-col gap-6">
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
                  className="border-none bg-gray-100 placeholder:font-semibold placeholder:text-[15px]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="text-[#48887B] mr-auto" htmlFor="password">
                    Пароль
                  </Label>
                  <Link href="/forgot-password">Забыли пароль?</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-none bg-gray-100 placeholder:font-semibold placeholder:text-[15px]"
                  required
                />
              </div>
            </div>
            {error && (
              <p className="text-red-500 mt-2">{translateError(error)}</p>
            )}

            <Button
              type="submit"
              className="cursor-pointer w-full bg-[#48887B] hover:bg-[#3c685f] mt-6"
            >
              Войти
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-6">
          <div className="spand">
            <span className="text-[15px] w-[150px]"> Или продолжить с </span>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <Image src={google} alt="google" width={30} height={30} />
            Google
          </Button>

          <div>
            <span className="text-[15px] w-[150px]">
              Нет аккаунта?
              <Link
                href="/sign-up"
                className="text-[#48887B] transition-all hover:text-black ml-1"
              >
                Регистрация
              </Link>
            </span>
          </div>
        </CardFooter>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] items-baseline flex justify-end bg-opacity-50 m-5">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl ">
            <p>Успешный вход!</p>
          </div>
        </div>
      )}

      <Image
        className="relative left-[7%] bottom-[50px]"
        src={frame}
        width={550}
        alt="Frame"
        height={800}
      />
    </div>
  );
};

export default SignIn;
