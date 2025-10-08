"use client";

import React, { useState,useRef,useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import { Button } from "@/components/ui/button";

interface Memorial {
  id: string;
  full_name: string;
  description: string;
  birth_date: string;
  death_date: string;
  photo_url: string | null;
  country?: string;
  city?: string;
}

export default function Search() {
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<Memorial[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setErrorMessage("");
    setLoading(true);

    if (!surname.trim() && !name.trim() && !location.trim()) {
      setErrorMessage("Введите хотя бы фамилию, имя или местоположение для поиска");
      setResults([]);
      setLoading(false);
      return;
    }
    let query = supabase.from("memorials").select("*");

    if (surname) query = query.ilike("full_name", `%${surname}%`);
    if (name) query = query.ilike("full_name", `%${name}%`);
    if (location) query = query.or(`city.ilike.%${location}%,country.ilike.%${location}%`);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка поиска:", error);
      setErrorMessage("Ошибка поиска: " + error.message);
      setResults([]);
    } else if (!data || data.length === 0) {
      setErrorMessage("Ничего не найдено");
      setResults([]);
    } else {
      setResults(data);
    }

    setLoading(false);
  }
  const [isPlaying, setIsPlaying] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);
  
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
  return (
    
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-md mt-8">
      
      <h1 className="text-3xl text-[#48887B] font-bold mb-8 text-center">
        Поиск памятной страницы
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-4">
        <div>
          <label className="block text-gray-700 mb-1">Фамилия</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[#48887B]"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[#48887B]"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Отчество</label>
          <input
            type="text"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[#48887B]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <label className="block text-gray-700 mb-1">Год рождения</label>
          <input
            type="text"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[#48887B]"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Год смерти</label>
          <input
            type="text"
            value={deathYear}
            onChange={(e) => setDeathYear(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[#48887B]"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Расположение</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[#48887B]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Введите название адреса, города или страны
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          onClick={handleSearch}
          className="bg-[#48887B] cursor-pointer text-white px-8 py-2 rounded-full hover:bg-[#48887B] transition"
        >
          {loading ? "Поиск..." : "Найти"}
        </Button>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-4 text-center">{errorMessage}</p>
      )}
      <ul className="space-y-6 mt-8">
        {results.map((person) => (
          <li key={person.id}>
            <Link
              href={`/dashboard/users-list/${person.id}`}
              className="block p-4 bg-gray-50 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {person.photo_url && (
                <img
                  src={person.photo_url}
                  alt={person.full_name}
                  width={100}
                  height={100}
                  className="rounded-lg border border-gray-300 object-cover flex-shrink-0"
                />
              )}
              <div className="text-left">
                <h3 className="text-lg font-semibold">{person.full_name}</h3>
                <p className="text-sm">
                  <span className="font-medium">Место захоронения: </span>{person.country}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Дата рождения: </span>
                  {person.birth_date
                    ? new Date(person.birth_date).toLocaleDateString("ru-RU")
                    : "—"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Дата смерти: </span>
                  {person.death_date
                    ? new Date(person.death_date).toLocaleDateString("ru-RU")
                    : "—"}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
