"use client";

import React, { useState } from "react";
import Image from "next/image";
import { supabase } from "../../../lib/supabaseClient";
import svg from "../../../public/Group 7 (1).svg";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import * as QRCode from "qrcode";


export default function AddList() {
  const [person, setFormData] = useState({
    full_name: "",
    iin: "",
    description: "",
    birth_date: "",
    death_date: "",
    religion: "",
    country: "",
    city: "",
    address: "",
    place_url: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Добавление...");

    try {
      let photoUrl: string | null = null;
      if (photo) {
        const cleanName = photo.name
          .replace(/[^\w.-]/g, "_")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const fileName = `${Date.now()}_${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(fileName, photo);

        if (uploadError) {
          console.error("Ошибка загрузки фото:", uploadError);
          setMessage("Ошибка загрузки фото");
          return;
        }

        photoUrl = `https://knydrirjmrexqyohethp.supabase.co/storage/v1/object/public/photos/${fileName}`;
      } else {
        photoUrl =
          "https://knydrirjmrexqyohethp.supabase.co/storage/v1/object/public/photos/nophoto.jpg";
      }
      const { data, error: insertError } = await supabase
        .from("memorials")
        .insert([{ ...person, photo_url: photoUrl }])
        .select()
        .single();

      if (insertError) {
        console.error("Ошибка вставки:", insertError);
        setMessage("Ошибка при добавлении страницы");
        return;
      }
      const qrUrl = `${window.location.origin}/users-list/${data.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrUrl);
      const qrBlob = await (await fetch(qrCodeDataUrl)).blob();
      const qrFileName = `qr_${data.id}.png`;

      const { error: qrUploadError } = await supabase.storage
        .from("photos")
        .upload(qrFileName, qrBlob);

      if (qrUploadError) {
        console.error("Ошибка загрузки QR:", qrUploadError);
      } else {
        const qrCodeUrl = `https://knydrirjmrexqyohethp.supabase.co/storage/v1/object/public/photos/${qrFileName}`;
        await supabase
          .from("memorials")
          .update({ qr_code_url: qrCodeUrl })
          .eq("id", data.id);
      }

      setMessage("Ваша страница успешно добавлена!");
      setFormData({
        full_name: "",
        iin: "",
        description: "",
        birth_date: "",
        death_date: "",
        religion: "",
        country: "",
        city: "",
        address: "",
        place_url: "",
      });
      setPhoto(null);
      setPhotoPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при добавлении страницы");
    }
  };

  return (
    <div>
      <h1 className="text-3xl text-[#48887B] font-bold mt-10 mb-8 text-center">
        Создайте страницу
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-[1190px] mx-auto flex flex-col gap-10 mt-10"
      >
        <div className="flex justify-center gap-5">
          <div className="flex flex-col items-center gap-5">
            <div className="border-2 border-[#48887B] w-[600px] h-[600px] relative rounded-xl flex justify-center items-center overflow-hidden">
              {photoPreview ? (
                <>
                  <Image
                    src={photoPreview}
                    alt="preview"
                    fill
                    className="object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition"
                    title="Удалить фото"
                  >
                    <X size={18} className="text-red-500" />
                  </button>
                </>
              ) : (
                <>
                  <Image
                    width={150}
                    height={150}
                    alt="SVG"
                    src={svg}
                    className="opacity-70"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
            <p>Нажмите, чтобы добавить фото</p>
          </div>

          <div className="w-[60%] flex flex-col gap-5">
            <input
              type="text"
              name="full_name"
              placeholder="ФИО"
              value={person.full_name}
              onChange={handleChange}
              className="p-3 border border-[#48887B] rounded-3xl"
              required
            />
            <input
              type="text"
              name="iin"
              placeholder="ИИН"
              value={person.iin}
              onChange={handleChange}
              className="p-3 border border-[#48887B] rounded-3xl"
              required
            />
            <textarea
              name="description"
              placeholder="Описание"
              value={person.description}
              onChange={handleChange}
              className="p-3 border border-[#48887B] rounded-3xl w-full h-40 resize-none"
              required
            />
            <label>Дата рождения:</label>
            <input
              type="date"
              name="birth_date"
              value={person.birth_date}
              onChange={handleChange}
              className="p-3 border border-[#48887B] rounded-3xl"
              required
            />
            <label>Дата смерти:</label>
            <input
              type="date"
              name="death_date"
              value={person.death_date}
              onChange={handleChange}
              className="p-3 border border-[#48887B] rounded-3xl"
              required
            />
            <div className="relative w-full">
              <select
                name="religion"
                value={person.religion}
                onChange={handleChange}
                className="p-3 border border-[#48887B] rounded-3xl bg-white text-gray-700 appearance-none w-full"
                required
              >
                <option value="">Выберите религию</option>
                <option value="Ислам">Ислам</option>
                <option value="Христианство">Христианство</option>
                <option value="Православие">Православие</option>
              </select>
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-3xl text-[#48887B] font-bold mb-8 text-center">
          Место захоронения
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="country"
            placeholder="Страна"
            value={person.country}
            onChange={handleChange}
            className="p-3 border border-[#48887B] rounded-3xl w-full"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="Город"
            value={person.city}
            onChange={handleChange}
            className="p-3 border border-[#48887B] rounded-3xl w-full"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Адрес"
            value={person.address}
            onChange={handleChange}
            className="p-3 border border-[#48887B] rounded-3xl w-full"
            required
          />
          <input
            type="url"
            name="place_url"
            placeholder="Ссылка на место (2GIS, Yandex Map, Google Maps)"
            value={person.place_url}
            onChange={handleChange}
            className="p-3 border border-[#48887B] rounded-3xl w-full"
            required
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-[#48887B] px-10 py-5 text-xl rounded-3xl"
          >
            Добавить
          </Button>
        </div>
      </form>

      {message && (
        <p className="mt-6 text-center text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
}
