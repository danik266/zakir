"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import QRCode from "qrcode";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import ReviewsSection from "./ReviewsSection";

export default function UserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [selectedSurah, setSelectedSurah] = useState<string>("al-fatiha.mp3");
  const [volume, setVolume] = useState<number>(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mediaView, setMediaView] = useState<"photo" | "video">("photo");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [modal, setModal] = useState<{ show: boolean; message: string; type: "success" | "error" | "" }>({
    show: false,
    message: "",
    type: "",
  });

  const surahList = [
    { name: "Аль-Фатиха", file: "al-fatiha.mp3" },
    { name: "Аят Аль-курси", file: "ayatalkursi.mp3" },
    { name: "Ыкылас", file: "ikhlas.mp3" },
    { name: "Дуа", file: "dua.mp3" },
  ];

  useEffect(() => {
    if (modal.show) {
      const timer = setTimeout(() => {
        setModal({ show: false, message: "", type: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [modal]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setCurrentUser(data.session.user);
    });
  }, []);

useEffect(() => {
  const loadUser = async () => {
    const { data: memorialData, error } = await supabase
      .from("memorials")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Ошибка загрузки:", error);
      setLoading(false);
      return;
    }

    if (memorialData) {
      // Обновляем просмотры
      await supabase
        .from("memorials")
        .update({ views: (memorialData.views || 0) + 1 })
        .eq("id", memorialData.id);

      // Обновим локальное состояние с новым количеством просмотров
      setUser({
        ...memorialData,
        views: (memorialData.views || 0) + 1,
        photos: Array.isArray(memorialData.photo_url)
          ? memorialData.photo_url
          : JSON.parse(memorialData.photo_url || "[]"),
        videos: Array.isArray(memorialData.video_url)
          ? memorialData.video_url
          : JSON.parse(memorialData.video_url || "[]"),
      });

      const pageUrl = `${window.location.origin}/dashboard/users-list/${memorialData.id}`;
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

    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) audioRef.current.play();
    }
  }, [selectedSurah]);

  const prevPhoto = () => {
    if (!user?.photos?.length) return;
    setCurrentIndex((prev) => (prev === 0 ? user.photos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    if (!user?.photos?.length) return;
    setCurrentIndex((prev) => (prev === user.photos.length - 1 ? 0 : prev + 1));
  };

  const prevVideo = () => {
    if (!user?.videos?.length) return;
    setVideoIndex((prev) => (prev === 0 ? user.videos.length - 1 : prev - 1));
  };

  const nextVideo = () => {
    if (!user?.videos?.length) return;
    setVideoIndex((prev) => (prev === user.videos.length - 1 ? 0 : prev + 1));
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    const { error } = await supabase.from("memorials").delete().eq("id", user.id);

    if (error) {
      setModal({
        show: true,
        message: "Ошибка при удалении страницы. Попробуйте снова.",
        type: "error",
      });
      console.error(error);
    } else {
      setModal({
        show: true,
        message: "Страница успешно удалена!",
        type: "success",
      });

      setTimeout(() => {
        router.push("/dashboard/users-list");
      }, 2000);
    }
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

 const canEdit =
  currentUser &&
  (
    currentUser.id === user.created_by ||
    currentUser.email === user.created_by_email ||
    ["shampatov00@gmail.com", "eldosnuktenov08@gmail.com", "abilmansursatalganov78@gmail.com"]
      .includes(currentUser.email)
  );

  return (
    <div className="min-h-screen py-5 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-xl mb-10 max-w-5xl mx-auto dark:bg-gray-800">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPlaying}
            onChange={togglePlay}
            className="w-5 h-5 accent-[#48887b]"
          />
          <span className="text-gray-700 font-medium dark:text-white">
            {isPlaying ? "Остановить чтение Корана" : "Включить чтение Корана"}
          </span>
        </label>

        <div className="flex items-center gap-3">
          <label className="text-gray-700 font-medium dark:text-white">Сура:</label>
          <select
            value={selectedSurah}
            onChange={(e) => setSelectedSurah(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#48887B] dark:text-white"
          >
            {surahList.map((s) => (
              <option key={s.file} value={s.file}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium dark:text-white">Громкость:</label>
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
        <audio ref={audioRef} loop preload="auto">
          <source src={`/audio/${selectedSurah}`} type="audio/mpeg" />
        </audio>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl overflow-hidden grid md:grid-cols-2 gap-8 p-8 dark:bg-gray-800">
        <div className="relative flex justify-center items-center flex-col">
          <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-2xl bg-gray-100 flex justify-center items-center dark:bg-gray-900">
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
                onError={(e) => ((e.target as HTMLImageElement).src = "/nophoto.jpg")}
              />
            </AnimatePresence>
          </div>
          <Link
                    href="/dashboard/dua"
                    className="text-xl text-[#48887B] border-white border-b-2 hover:border-b-2 pb-1
                    hover:border-[#48887B]"
                    >
                     Құран бағыштау за <b>{user.full_name}</b>
                    </Link>
        </div>

        <div className="flex flex-col justify-start">
          <div className="flex justify-between items-start flex-wrap gap-2 mb-5">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white break-words max-w-[80%]">
              {user.full_name}
            </h1>

            {canEdit && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href={`/dashboard/users-list/edit/${user.id}`}
                  className="px-4 py-2 bg-[#48887B] text-white rounded-lg hover:bg-[#3a6b63] transition"
                >
                  Редактировать
                </Link>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>

          <p className="mb-2">
            <span className="font-semibold dark:text-white">Дата рождения:</span>{" "}
            {user.birth_date || "—"}
          </p>
          <p className="mb-2">
            <span className="font-semibold dark:text-white">Дата смерти:</span>{" "}
            {user.death_date || "—"}
          </p>
          <p className="mb-5">
            <span className="font-semibold dark:text-white">Религия:</span>{" "}
            {user.religion || "—"}
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            Место захоронения:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-800 mb-8 dark:text-white">
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
            <div className="flex flex-col items-center md:items-start gap-2">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-36 h-36 border border-gray-300 rounded-lg bg-white p-2"
              />
              <p className="text-sm text-gray-600 dark:text-white">
                Сканируйте, чтобы открыть страницу
              </p>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 dark:bg-gray-800 dark:text-white">
            <p>
              <span className="font-semibold text-[#48887B]">Создал:</span>{" "}
              {user?.created_by_name || "Неизвестно"}
            </p>
            <p>
              <span className="font-semibold text-[#48887B]">Дата создания:</span>{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleString("ru-RU", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })
                : "—"}
            </p>
            <div className="mt-2 text-sm text-gray-500 dark:text-white">
          Просмотров: <span className="font-semibold">{user.views || 0}</span>
        </div>
          </div>
        </div>
      </div>

      {(user?.photos?.length > 0 || user?.videos?.length > 0) && (
        <div className="max-w-6xl mx-auto mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setMediaView("photo")}
              className={`px-6 py-2 rounded-lg text-lg font-medium transition ${
                mediaView === "photo"
                  ? "bg-[#48887B] text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-white"
              }`}
            >
              Фото
            </button>
            <button
              onClick={() => setMediaView("video")}
              className={`px-6 py-2 rounded-lg text-lg font-medium transition ${
                mediaView === "video"
                  ? "bg-[#48887B] text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-white"
              }`}
            >
              Видео
            </button>
          </div>

          {mediaView === "photo" && user?.photos?.length > 0 && (
            <div className="relative flex justify-center items-center">
              <motion.img
                key={currentIndex}
                src={user.photos[currentIndex]}
                alt={`photo-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl shadow-lg max-h-[500px] object-contain"
                onError={(e) => ((e.target as HTMLImageElement).src = "/nophoto.jpg")}
              />
              {user.photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          )}

          {mediaView === "video" && user?.videos?.length > 0 && (
            <div className="relative flex justify-center items-center">
              <video
                key={videoIndex}
                src={user.videos[videoIndex]}
                controls
                className="w-full rounded-2xl shadow-md max-h-[500px]"
                preload="metadata"
              />
              {user.videos.length > 1 && (
                <>
                  <button
                    onClick={prevVideo}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextVideo}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          )}

          {mediaView === "video" && (!user.videos || user.videos.length === 0) && (
            <p className="text-center text-gray-500 text-lg">Видео отсутствуют</p>
          )}
          {mediaView === "photo" && (!user.photos || user.photos.length === 0) && (
            <p className="text-center text-gray-500 text-lg">Фото отсутствуют</p>
          )}
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-md mt-10 p-8 grid grid-cols-1 md:grid-cols-2 gap-10 dark:bg-gray-800">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Описание
          </h2>
          <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-line break-words dark:text-white">
            {user.description || "Нет описания"}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Слова памяти
          </h2>
          <ReviewsSection memorialId={id as string} />
        </div>
      </div>

      <div className="text-center mt-10">
        <Link href="/dashboard/users-list" className="text-[#48887B] hover:underline text-lg">
          ← Вернуться к списку
        </Link>
      </div>

      <AnimatePresence>
        {modal.show && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex justify-center items-center backdrop-blur-sm"
          >
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg px-6 py-4 text-center ${
                modal.type === "success" ? "text-[#48887B]" : "text-red-600"
              }`}
            >
              <p
                className={`text-base font-medium ${
                  modal.type === "success" ? "text-[#48887B]" : "text-red-600"
                }`}
              >
                {modal.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
