"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

interface Memorial {
  id: string;
  full_name: string;
  iin: string;
  description: string;
  birth_date: string;
  death_date: string;
  photo_url: string | null;
  created_at?: string;
}

const List = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    const fetchMemorials = async () => {
      setLoading(true);
      const { data, error, count, status } = await supabase
        .from("memorials")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      console.log("Supabase response:", { data, error, count, status });
      setDebug({ data, error, count, status });

      if (error) {
        console.error("Ошибка при загрузке memorials:", error);
      } else {
        setMemorials(data ?? []);
      }

      setLoading(false);
    };

    fetchMemorials();
  }, []);

  return (
    
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl text-[#48887B] font-bold mb-8 text-center">
        База захоронения
      </h1>
      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : memorials.length === 0 ? (
        <div className="text-center text-gray-600">
          Пока нет добавленных людей
        </div>
      ) : (
       <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
  {memorials.map((person) => (
    <li key={person.id}>
      <Link
        href={`/dashboard/users-list/${person.id}`}
        className="max-h-[500px] block p-4 bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
        {person.photo_url && (
          <div className="w-[160px] h-[200px] mx-auto overflow-hidden rounded-lg border border-gray-300">
            <img
              src={person.photo_url}
              alt={person.full_name}
              className="w-full h-full object-cover"
            />
          </div>
      )}
        <div className="text-center mt-3">
          <h3 className="text-lg font-semibold">
            {person.full_name}
          </h3>
          <p className="text-sm">
            <span className="font-medium">Дата рождения:</span>{" "}
            {person.birth_date
              ? new Date(person.birth_date).toLocaleDateString("ru-RU")
              : "-"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Дата смерти:</span>{" "}
            {person.death_date
              ? new Date(person.death_date).toLocaleDateString("ru-RU")
              : "-"}
          </p>
        </div>
      </Link>
    </li>
  ))}
</ul>
      )}
    </div>
  );
};

export default List;
