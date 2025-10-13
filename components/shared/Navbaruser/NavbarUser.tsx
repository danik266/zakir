  "use client";
  import React, { useEffect, useState } from "react";
  import Image from "next/image";
  import logo from "../../../public/logo.svg";
  import zakir from "../../../public/Безымянный-1.svg";
  import { useRouter, usePathname } from "next/navigation";
  import { supabase } from "../../../lib/supabaseClient";
  import { Button } from "@/components/ui/button";
  import { path } from "./links";
  import { Menu, X } from "lucide-react";
  import ThemeToggle from "@/components/shared/ThemeToggle/ThemeToggle";


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
    const [isOpen, setIsOpen] = useState(false);

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
      setIsOpen(false); 
    };

    return (
      <>
        <nav className="w-full z-20 bg-white shadow-md fixed top-0 left-0 px-5 py-3  dark:bg-gray-900">
          <div className="max-w-7xl mx-auto flex justify-between items-center">

            <div className="flex items-center gap-2">
              <Image width={50} height={50} alt="Zakir logo" src={logo} />
              <Image width={90} height={50} alt="Zakir text" src={zakir} />
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            <div className="hidden md:flex flex-wrap items-center gap-3">
              {path.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <Button
                    key={index}
                    onClick={() => handleAdd(item.path)}
                    className={`px-4 py-2 text-base ${
                      isActive ? "bg-[#48887B] text-white" : "bg-white text-black dark:bg-gray-800 dark:text-white dark:hover:bg-[#48887B]"
                    } hover:bg-[#48887B] hover:text-white`}
                  >
                    {item.name}
                  </Button>
                );
              })}

            </div>
              
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                <ThemeToggle />
                  <span className="text-base">
                    👤 {user.user_metadata?.full_name || user.user_metadata?.display_name || "Пользователь"}
                  </span>
                  <Button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white text-base px-4 py-2"
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => router.push("/sign-in")}
                  className="bg-white text-[#48887B] hover:bg-gray-200 text-base px-4 py-2"
                >
                  Войти
                </Button>
              )}
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden mt-2 flex flex-col gap-3 px-2 text-center">
              {path.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <Button
                    key={index}
                    onClick={() => handleAdd(item.path)}
                    className={`w-full px-4 py-3 text-base ${
                      isActive ? "bg-[#48887B] text-white" : "bg-white text-black dark:bg-gray-800 dark:text-white dark:hover:bg-[#48887B]"
                    } hover:bg-[#48887B] hover:text-white`}
                  >
                    {item.name}
                  </Button>
                );
              })}

              {user ? (
                <>
                  <span className="w-full text-base px-4 py-2 block">
                    👤 {user.user_metadata?.full_name || user.user_metadata?.display_name || "Пользователь"}
                  </span>
                  <Button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-base bg-red-500 hover:bg-red-600 text-white"
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => { router.push("/sign-in"); setIsOpen(false); }}
                  className="w-full px-4 py-3 text-base bg-white text-[#48887B] hover:bg-gray-200"
                >
                  Войти
                </Button>
              )}
            </div>
            
          )}
        </nav>
        <div className="pt-[72px] md:pt-[80px]"></div>
      </>
    );
  };

  export default NavbarUser;
