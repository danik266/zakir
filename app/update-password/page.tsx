"use client";

import React, { useState } from "react";
import Image from "next/image";
import zakir from "../../public/Безымянный-1.svg";
import { Button } from "@/components/ui/button";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Пароль успешно обновлён! ✅");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-center mb-6">
          <Image src={zakir} alt="logo" className="w-20 h-20" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">
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
          <Button type="submit" className="w-full">
            Обновить пароль
          </Button>
        </form>
        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}
