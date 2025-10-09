"use client";

import React, { useState } from "react";
import Image from "next/image";
import zakir from "../../public/Безымянный-1.svg";
import { Button } from "@/components/ui/button";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import frame from "../../public/Frame 1 (1).png";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setModalMessage("Пароли не совпадают");
      setIsOpen(true);
      setTimeout(() => setIsOpen(false), 3000);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setModalMessage("Ошибка: " + error.message);
    } else {
      setModalMessage("Пароль успешно обновлён!");
      setTimeout(() => {
        setIsOpen(false);
        router.push("/sign-in");
      }, 2000);
    }

    setIsOpen(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md md:max-w-lg bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <div className="flex justify-center mb-6">
          <Image src={zakir} alt="logo" className="w-20 h-20 md:w-24 md:h-24" />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
          Обновить пароль
        </h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Новый пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <Button type="submit" className="w-full bg-[#48887B] hover:bg-[#3c685f] text-white py-3 rounded-md">
            Обновить пароль
          </Button>
        </form>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/30 px-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-xs md:max-w-sm shadow-2xl text-center">
              <p
                className={`text-base md:text-lg font-medium ${
                  modalMessage.includes("Ошибка") || modalMessage.includes("не совпадают")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {modalMessage}
              </p>
            </div>
            
          </div>
        )}
        
      </div>
      <div className="w-full max-w-md md:max-w-[500px] flex justify-center md:justify-start mt-6 md:mt-0 hidden md:flex">
  <Image
    className="w-full h-auto object-contain"
    src={frame}
    alt="Frame"
    priority
  />
</div>
    </div>
  );
}
