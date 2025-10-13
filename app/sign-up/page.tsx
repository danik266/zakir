"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import zakir from "../../public/Безымянный-1.svg";
import Link from "next/link";
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
import { supabase } from "@/lib/supabaseClient";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { display_name: form.name } },
    });

    setLoading(false);

    if (error) {
      setError("Ошибка: " + error.message);
    } else {
      setError(null);
      setIsOpen(true);
      console.log(data);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        setIsOpen(false);
        router.push("/sign-in");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9f8] to-[#d6e8e3] flex flex-col md:flex-row justify-center items-center px-4 py-10 md:py-0 gap-8 md:gap-20">
      <Card className="w-full max-w-[400px] md:max-w-[500px] border-none shadow-lg rounded-2xl bg-white">
        <CardHeader className="text-center">
          <Image
            className="mx-auto mb-4"
            width={90}
            height={60}
            alt="zakir"
            src={zakir}
          />
          <CardTitle className="text-2xl md:text-3xl font-semibold text-black">
            Добро пожаловать!
          </CardTitle>
          <CardDescription className="text-[#48887B] text-sm md:text-base">
            Пожалуйста, введите ваши данные для регистрации
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label className="text-[#48887B]" htmlFor="name">
                Имя пользователя
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Введите имя"
                className="border-none bg-gray-100 placeholder:font-medium"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-[#48887B]" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Введите email"
                className="border-none bg-gray-100 placeholder:font-medium"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-[#48887B]" htmlFor="password">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                className="border-none bg-gray-100 placeholder:font-medium"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-[#48887B]" htmlFor="confirm">
                Подтвердите пароль
              </Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Введите пароль еще раз"
                className="border-none bg-gray-100 placeholder:font-medium"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-[#48887B] hover:bg-[#3c685f] text-white font-medium mt-4"
            >
              {loading ? "Загрузка..." : "Зарегистрироваться"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-5 text-center">
          <span className="text-sm text-black">
            Уже есть аккаунт?
            <Link
              href="/sign-in"
              className="text-[#48887B] hover:text-black ml-1 font-medium"
            >
              Войти
            </Link>
          </span>
        </CardFooter>
      </Card>
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
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/30">
          <div className="bg-white rounded-xl p-6 w-80 shadow-2xl text-center">
            <p className="text-lg font-medium text-[#48887B]">
              Регистрация успешна! Проверьте почту для подтверждения.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
