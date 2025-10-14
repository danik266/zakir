"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

interface Memorial {
  id: string;
  full_name: string;
  description?: string;
  birth_date?: string;
  death_date?: string;
  photo_url?: string | string[] | null;
  photos?: string[];
}

const List = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const { data, error } = await supabase
        .from("memorials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Ошибка при загрузке:", error);
        setLoading(false);
        return;
      }

      const baseUrl =
        "https://knydrirjmrexqyohethp.supabase.co/storage/v1/object/public/photos/";

      const normalized = (data ?? []).map((item: any) => {
        let photos: string[] = [];

        if (Array.isArray(item.photo_url)) {
          photos = item.photo_url;
        } else if (typeof item.photo_url === "string") {
          try {
            const parsed = JSON.parse(item.photo_url);
            photos = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            photos = [item.photo_url];
          }
        }

        photos = photos
          .filter(Boolean)
          .map((url: string) =>
            url.startsWith("http")
              ? url.startsWith("https:/") && !url.startsWith("https://")
                ? url.replace("https:/", "https://")
                : url
              : `${baseUrl}${url}`
          );

        return { ...item, photos };
      });

      setMemorials(normalized);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту запись?")) return;

    const { error } = await supabase.from("memorials").delete().eq("id", id);
    if (error) {
      console.error("Ошибка при удалении:", error);
    } else {
      setMemorials((prev) => prev.filter((m) => m.id !== id));
    }
  };

const isAdmin = ["shampatov00@gmail.com", "eldosnuktenov08@gmail.com", "abilmansursatalganov78@gmail.com"].includes(user?.email);

  if (loading) return <div className="text-center mt-10">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#48887B] mb-8 text-center">
        База захоронения
      </h1>

      {memorials.length === 0 ? (
        <div className="text-center text-gray-600">Пока нет добавленных людей</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 ">
          {memorials.map((person) => {
            const photo =
              person.photos && person.photos.length > 0 ? person.photos[0] : null;
            return (
              <li key={person.id} className="relative">
                <Link
                  href={`/dashboard/users-list/${person.id}`}
                  className="block p-4 bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 dark:bg-gray-800"
                >
                  <div className="w-[160px] h-[200px] mx-auto rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden dark:bg-gray-900">
                    {photo ? (
                      <img
                        src={photo}
                        alt={person.full_name}
                        className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = "/nophoto.jpg")
                        }
                      />
                    ) : (
                      <div className="text-sm text-gray-400 text-center">
                        Нет фото
                      </div>
                    )}
                  </div>

                  <div className="text-center mt-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {person.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Дата рождения:</span>{" "}
                      {person.birth_date
                        ? new Date(person.birth_date).toLocaleDateString("ru-RU")
                        : "-"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Дата смерти:</span>{" "}
                      {person.death_date
                        ? new Date(person.death_date).toLocaleDateString("ru-RU")
                        : "-"}
                    </p>
                  </div>
                </Link>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="absolute top-2 border p-2 rounded-4xl right-2 translition-all text-red-500 hover:text-white hover:bg-red-500 text-xl font-bold"
                    title="Удалить запись">
                   ✕
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default List;
