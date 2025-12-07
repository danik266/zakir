"use client";
import Main from "@/components/shared/Main/Main"
import Need from "@/components/shared/Need/Need"
import Advant from "@/components/shared/Advant/Advant"
import Navbar from "@/components/shared/Navbar/Navbar"
import Footer from "@/components/shared/Footer/Footer"
import Snow from "@/components/shared/Snow/Snow";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      }
    };

    checkUser();
  }, [router]);
  return (
   <>
   <div className="flex flex-col bg-amber-50">
    <Navbar/>
    
    <Main/>
    <Need/>
    <Advant/>
    <Footer/>
    <Snow />
   </div>
    
   </>
  )
}
