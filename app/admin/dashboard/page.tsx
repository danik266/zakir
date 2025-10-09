"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [memorials, setMemorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) router.push("/admin/login");
    else fetchMemorials();
  }, []);

  // Подгрузка данных из таблицы memorials
  const fetchMemorials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("memorials")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.log("Error fetching memorials:", error);
    else setMemorials(data || []);
    setLoading(false);
  };

const deleteMemorial = async (id: string) => {
  if (!confirm("Вы точно хотите удалить эту запись?")) return;

  const { error } = await supabase
    .from("memorials")
    .delete()
    .eq("id", id); // id должен быть uuid в строковом виде

  if (error) {
    alert("Ошибка при удалении: " + error.message);
    console.log(error);
  } else {
    alert("Запись удалена");
    fetchMemorials(); // обновляем список после удаления
  }
};

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading memorials...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memorials.length === 0 ? (
            <p>Нет памятных записей</p>
          ) : (
            memorials.map((memorial) => (
              <div
                key={memorial.id}
                className="bg-white p-6 rounded-xl shadow-lg flex flex-col"
              >
                {memorial.photo_url && (
                  <img
                    src={memorial.photo_url}
                    alt={memorial.full_name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold mb-1">{memorial.full_name}</h2>
                <p className="text-gray-500 mb-1">
                  {memorial.birth_date} — {memorial.death_date}
                </p>
                <p className="text-gray-500 mb-1">{memorial.religion}, {memorial.country}, {memorial.city}</p>
                <p className="text-gray-500 mb-2">{memorial.address}</p>
                {memorial.place_url && (
                  <a
                    href={memorial.place_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mb-2"
                  >
                    Ссылка на место
                  </a>
                )}
                {memorial.description && (
                  <p className="text-gray-700 mb-2">{memorial.description.substring(0, 150)}...</p>
                )}
                {memorial.wordsinmemorial && (
                  <p className="text-gray-800 font-medium mb-4">{memorial.wordsinmemorial}</p>
                )}
                <button
      onClick={() => deleteMemorial(memorial.id)}
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition self-start"
    >
      Удалить
    </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
