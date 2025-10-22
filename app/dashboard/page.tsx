"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "next-themes";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("https://zakir-ten.vercel.app/sign-up");
      } else {
        setUserEmail(session.user.email ?? null);
      }
      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-20 dark:text-gray-200">Загрузка...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-colors duration-300">
      <div className="flex justify-end">

      </div>

      <h1 className="text-3xl font-bold mt-3 mb-8 text-center text-[#48887B] dark:text-emerald-400">
        Добро пожаловать!
      </h1>

      <p className="mb-8 text-gray-700 dark:text-gray-300 text-[17px] text-center">
        Этот сайт создан для сохранения памяти о близких и значимых людях в мусульманской традиции.
      </p>

      <div className="grid gap-6">
        <div className="flex flex-col items-center bg-emerald-50 dark:bg-emerald-950 p-4 rounded-lg shadow transition-colors duration-300">
          <div className="w-50 h-25 mb-2 flex items-center justify-center">
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#48887B" />
              <path
                d="M24 28c4 0 8 2 8 4v2H16v-2c0-2 4-4 8-4zm0-2a6 6 0 100-12 6 6 0 000 12z"
                fill="#fff"
              />
            </svg>
          </div>
          <h2 className="font-semibold text-lg mb-1 text-[#48887B] dark:text-emerald-400">
            Добавьте человека
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Создайте страницу памяти, добавьте фотографии, биографию и важные даты.
          </p>
        </div>

        {/* Карточка 2 */}
        <div className="flex flex-col items-center bg-emerald-50 dark:bg-emerald-950 p-4 rounded-lg shadow transition-colors duration-300">
          <div className="w-20 h-20 mb-2 flex items-center justify-center">
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#48887B" />
              <path d="M24 16c-3 0-5 2-5 5v7h10v-7c0-3-2-5-5-5z" fill="#fff" />
            </svg>
          </div>
          <h2 className="font-semibold text-lg mb-1 text-[#48887B] dark:text-emerald-400">
            Оставьте молитву
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Напишите дуа или добрые слова в память о человеке.
          </p>
        </div>

        {/* Карточка 3 */}
        <div className="flex flex-col items-center bg-emerald-50 dark:bg-emerald-950 p-4 rounded-lg shadow transition-colors duration-300">
          <div className="w-20 h-20 mb-2 flex items-center justify-center">
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#48887B" />
              <path d="M32 24l-8-8v6H16v4h8v6l8-8z" fill="#fff" />
            </svg>
          </div>
          <h2 className="font-semibold text-lg mb-1 text-[#48887B] dark:text-emerald-400">
            Поделитесь воспоминаниями
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Пригласите родных и друзей, чтобы вместе хранить память.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          className="bg-[#48887B] hover:bg-[#3e776d] text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-300"
          onClick={() => router.push("/dashboard/add-list")}
        >
          Начать добавление памяти
        </Button>
      </div>
    </div>
  );
}