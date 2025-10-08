"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../public/logo.svg";
import zakir from "../../../public/Безымянный-1.svg";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { path } from "./links";

interface UserMetaData {
  full_name?: string;
  display_name?: string;
}

interface SupabaseUser {
  user_metadata?: UserMetaData;
}

const NavbarUser: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user as SupabaseUser);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as SupabaseUser | null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleAdd = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-full z-10 bg-white p-4 md:p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
      {/* Логотип */}
      <div className="flex items-center gap-2">
        <Image width={50} height={50} alt="Zakir logo" src={logo} />
        <span>
          <Image width={90} height={50} alt="Zakir text" src={zakir} />
        </span>
      </div>

      {/* Меню навигации */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-2 md:mt-0">
        {path.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <Button
              key={index}
              onClick={() => handleAdd(item.path)}
              className={`px-4 py-2 text-sm md:text-base ${
                isActive ? "bg-[#48887B] text-white" : "bg-white text-black"
              } hover:bg-[#48887B] hover:text-white`}
            >
              {item.name}
            </Button>
          );
        })}
      </div>

      {/* Пользователь */}
      <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-2 md:gap-3 items-center">
        {user ? (
          <>
            <span className="text-sm">
              👤 {user.user_metadata?.full_name || user.user_metadata?.display_name || "Пользователь"}
            </span>
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm md:text-base px-3 py-1"
            >
              Выйти
            </Button>
          </>
        ) : (
          <Button
            onClick={() => router.push("/sign-in")}
            className="bg-white text-[#48887B] hover:bg-gray-200 text-sm md:text-base px-3 py-1"
          >
            Войти
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavbarUser;
