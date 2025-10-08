"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../public/logo.svg";
import zakir from "../../../public/Безымянный-1.svg";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { path } from './links'
import {usePathname} from 'next/navigation'

const NavbarUser = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, } = await supabase.auth.getSession();
    };

    getUser();
    
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); 
  };

  const handleAdd = (path:string) =>{
    router.push(path);
  }
  return (
    <div className="w-full z-10 bg-white p-5 mx-auto flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <Image width={70} height={70} alt="Zakir logo" src={logo} />
        <span>
          <Image width={100} height={70} alt="zakir" src={zakir} />
        </span>
      </div>

      <div className="flex gap-4">
        {path.map((item,index)=>{
          const isActive = pathname === item.path
          return (
            <Button 
            key={index}
            onClick={()=>handleAdd(`${item.path}`)}
            className={`${isActive ? 'bg-[#48887B] text-white': 'bg-white text-black'} hover:bg-[#48887B] hover:text-white`}>
            {item.name}
        </Button>
          )
        })}
        
        
      </div>

      <div>
        {user ? (
          <div className="flex gap-3 items-center">
            <span className="text-sm">
              👤 {user.user_metadata.full_name} 
              {user.user_metadata?.display_name}
            </span>
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Выйти
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => router.push("/sign-in")}
            className="bg-white text-[#48887B] hover:bg-gray-200">
            Войти
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavbarUser;
