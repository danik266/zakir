"use client";
import { useEffect, useState, useRef } from "react";
import { use } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import QRCode from "qrcode";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = "https://zakir-ten.vercel.app/sign-up";
        return;
      }
      const { data: userData, error } = await supabase
        .from("memorials")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && userData) {
        setUser(userData);
        const pageUrl = `${window.location.origin}/dashboard/users-list/${userData.id}`;
        const qrDataUrl = await QRCode.toDataURL(pageUrl);
        setQrCodeUrl(qrDataUrl);
      }

      setLoading(false);
    };

    checkAuthAndLoad();
  }, [id]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Загрузка...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-red-600 text-lg">
        Мемориальная страница не найдена.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-white rounded-xl shadow mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPlaying}
            onChange={togglePlay}
            className="w-5 h-5 accent-green-600"
          />
          <span className="text-gray-700 font-medium">
            {isPlaying ? "Остановить чтение Корана" : "Включить чтение Корана"}
          </span>
        </label>
        <audio ref={audioRef} loop preload="auto" autoPlay>
          <source src="/../audio/Mishary_001.mp3" type="audio/mpeg" />
        </audio>
      </div>
      <div className="min-h-screen py-8 px-4 flex flex-col items-center">
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
          <div className="bg-gray-100 flex flex-col items-center justify-center p-6">
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.full_name}
                className="w-72 h-96 object-cover rounded-xl shadow-md mb-6"
              />
            ) : (
              <div className="w-72 h-96 flex items-center justify-center text-gray-400 text-lg bg-gray-200 rounded-xl mb-6">
                Нет фото
              </div>
            )}
          </div>
          <div className="flex flex-col justify-start p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-5">{user.full_name}</h1>

            <p className="mb-2">
              <span className="font-semibold">Дата рождения:</span> {user.birth_date || "—"}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Дата смерти:</span> {user.death_date || "—"}
            </p>
            <p className="mb-5">
              <span className="font-semibold">Религия:</span> {user.religion || "—"}
            </p>

            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Место захоронения:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-800 mb-8">
              <p>
                <span className="font-semibold">Страна:</span> {user.country || "—"}
              </p>
              <p>
                <span className="font-semibold">Город:</span> {user.city || "—"}
              </p>
              <p>
                <span className="font-semibold">Адрес:</span> {user.address || "—"}
              </p>
              <p>
                <span className="font-semibold">Ссылка:</span>{" "}
                {user.place_url ? (
                  <a
                    href={user.place_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#48887B] hover:underline break-all"
                  >
                    Нажмите здесь
                  </a>
                ) : (
                  "—"
                )}
              </p>
            </div>
            {qrCodeUrl && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-36 h-36 border border-gray-300 rounded-lg shadow-sm bg-white p-2"
                />
                <p className="text-sm text-gray-600 text-center">
                  Сканируйте, чтобы открыть страницу
                </p>
              </div>
            )}
            <div className="mt-auto text-right">
              <Link
                href="/dashboard/users-list"
                className="text-[#48887B] text-lg hover:underline">
                Вернуться к страницам
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md mt-10 p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Описание</h2>
            <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-line break-words">
              {user.description || "Нет описания"}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Слова памяти</h2>
            <div className="bg-gray-50 border-l-4 border-[#48887B] p-5 rounded-xl shadow-sm italic text-gray-700 leading-relaxed">
              {user.wordsinmemorial ||
                "Этот человек был очень прекрасным, добрым и светлым. Его память навсегда останется в наших сердцах."}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
