"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import QRCode from "qrcode";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedSurah, setSelectedSurah] = useState<string>("al-fatiha.mp3");
  const [volume, setVolume] = useState<number>(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const surahList = [
    { name: "Аль-Фатиха", file: "al-fatiha.mp3" },
    { name: "Аят Аль-курси", file: "ayatalkursi.mp3" },
    { name: "Ыкылас", file: "ikhlas.mp3" },
    { name: "Дуа", file: "dua.mp3" },
  ];

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase
        .from("memorials")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Ошибка загрузки:", error);
        setLoading(false);
        return;
      }

      if (data) {
        let photos: string[] = [];

        if (Array.isArray(data.photo_url)) {
          photos = data.photo_url;
        } else if (typeof data.photo_url === "string") {
          try {
            const parsed = JSON.parse(data.photo_url);
            photos = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            photos = [data.photo_url];
          }
        }

        // исправляем ссылки "https:/"
        photos = photos.map((url) =>
          url.startsWith("https:/") && !url.startsWith("https://")
            ? url.replace("https:/", "https://")
            : url
        );

        setUser({ ...data, photos });

        const pageUrl = `${window.location.origin}/dashboard/users-list/${data.id}`;
        const qr = await QRCode.toDataURL(pageUrl);
        setQrCodeUrl(qr);
      }

      setLoading(false);
    };

    loadUser();
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) audioRef.current.play();
    }
  }, [selectedSurah]);

  const prevPhoto = () => {
    if (!user?.photos?.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? user.photos.length - 1 : prev - 1
    );
  };

  const nextPhoto = () => {
    if (!user?.photos?.length) return;
    setCurrentIndex((prev) =>
      prev === user.photos.length - 1 ? 0 : prev + 1
    );
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-lg text-gray-600 animate-pulse">
        Загрузка...
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-10 text-lg text-gray-500">
        Мемориальная страница не найдена
      </div>
    );
  return (
    <div className="min-h-screen py-5 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-xl shadow mb-10 max-w-5xl mx-auto">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPlaying}
            onChange={togglePlay}
            className="w-5 h-5 accent-[#48887b]"
          />
          <span className="text-gray-700 font-medium">
            {isPlaying ? "Остановить чтение Корана" : "Включить чтение Корана"}
          </span>
        </label>
        <div className="flex items-center gap-3">
          <label className="text-gray-700 font-medium">Сура:</label>
          <select
            value={selectedSurah}
            onChange={(e) => setSelectedSurah(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#48887B]"
          >
            {surahList.map((s) => (
              <option key={s.file} value={s.file}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Громкость:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-32 accent-[#48887b]"
          />
        </div>

        <audio ref={audioRef} loop preload="auto" autoPlay>
          <source src={`/audio/${selectedSurah}`} type="audio/mpeg" />
        </audio>
      </div>
<<<<<<< HEAD
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2 gap-8 p-8">
        <div className="relative flex justify-center items-center flex-col">
          {user.photos && user.photos.length > 0 ? (
            <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-2xl shadow-lg bg-gray-100 flex justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={user.photos[currentIndex]}
                  alt={`photo-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-full max-h-full object-contain rounded-2xl"
=======

      <div className="min-h-screen py-8 px-4 flex flex-col items-center">
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
          <div className=" flex items-center justify-center p-6">
            {user.photo_url ? (
              <div className="flex flex-col items-center gap-5">
                <img
                src={user.photo_url}
                alt={user.full_name}
                className="w-full max-w-md md:max-w-lg h-auto max-h-80 md:max-h-[600px] object-contain rounded-xl shadow-md mb-6"
              />
                <div className="">
                  <Link
                    href="/dashboard/dua"
                    className="text-xl text-[#48887B] hover:border-b-2 pb-1
                    hover:border-[#48887B]"
                    >
                     Құран бағыштау за <b>{user.full_name}</b>
                    </Link>
                </div>
              </div>
              
            ) : (
              <div className="w-full h-80 md:h-[600px] flex items-center justify-center text-gray-400 text-lg mb-6">
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
>>>>>>> 116057f822afd2ed05d664efa02b0234b53dff4d
                />
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-gray-400 text-lg text-center">Нет фото</div>
          )}

          {user.photos?.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <Link
            href="/dashboard/dua"
            className="mt-4 text-xl text-[#48887B] border-b-2 border-transparent pb-1 hover:border-[#48887B] transition"
          >
            Құран бағыштау за <b>{user.full_name}</b>
          </Link>
        </div>
        <div className="flex flex-col justify-start">
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
            <p><span className="font-semibold">Страна:</span> {user.country || "—"}</p>
            <p><span className="font-semibold">Город:</span> {user.city || "—"}</p>
            <p><span className="font-semibold">Адрес:</span> {user.address || "—"}</p>
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
            <div className="flex flex-col items-center md:items-start gap-2">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-36 h-36 border border-gray-300 rounded-lg shadow-sm bg-white p-2"
              />
              <p className="text-sm text-gray-600">Сканируйте, чтобы открыть страницу</p>
            </div>
          )}
        </div>
      </div>

      {/* 🕊️ Описание и слова памяти */}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-md mt-10 p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
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
              "Этот человек был очень добрым и светлым. Его память останется в наших сердцах."}
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <Link href="/dashboard/users-list" className="text-[#48887B] hover:underline text-lg">
          ← Вернуться к списку
        </Link>
      </div>
    </div>
  );
}
