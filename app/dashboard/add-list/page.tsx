"use client";

import React, { useState } from "react";
import Image from "next/image";
import { supabase } from "../../../lib/supabaseClient";
import svg from "../../../public/Group 7 (1).svg";
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
  const [isClicked, setIsClicked] = useState(false); // 👈 флаг одного клика

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
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🚫 если кнопка уже нажата — выходим
    if (isClicked) return;
    setIsClicked(true); // 👈 блокируем кнопку навсегда
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

        if (uploadError) throw uploadError;

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

      if (insertError) throw insertError;

      // QR-код
      const qrUrl = `${window.location.origin}/users-list/${data.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrUrl);
      const qrBlob = await (await fetch(qrCodeDataUrl)).blob();
      const qrFileName = `qr_${data.id}.png`;

      const { error: qrUploadError } = await supabase.storage
        .from("photos")
        .upload(qrFileName, qrBlob);

      if (!qrUploadError) {
        const qrCodeUrl = `https://knydrirjmrexqyohethp.supabase.co/storage/v1/object/public/photos/${qrFileName}`;
        await supabase
          .from("memorials")
          .update({ qr_code_url: qrCodeUrl })
          .eq("id", data.id);
      }

      setMessage("✅ Ваша страница успешно добавлена!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Ошибка при добавлении страницы");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-20 py-10">
      <h1 className="text-3xl sm:text-4xl text-[#48887B] font-bold mb-8 text-center">
        Создайте страницу
      </h1>
<form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 w-full max-w-[1200px] mx-auto"
      >
        <div className="flex flex-col lg:flex-row justify-center gap-8">
          {/* Фото */}
          <div className="flex flex-col items-center gap-5 w-full lg:w-[50%]">
            <div className="border-2 border-[#48887B] w-full max-w-[600px] aspect-square relative rounded-xl flex justify-center items-center overflow-hidden">
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

          {/* Данные */}
          <div className="flex flex-col gap-5 w-full lg:w-[50%]">
            <input
              type="text"
              name="full_name"
              placeholder="ФИО"
              value={person.full_name}
              onChange={handleChange}
              className="p-3 border border-[#48887B] rounded-3xl w-full"
              required
            />
            <input
              type="text"
              name="iin"
              placeholder="ИИН"
              value={person.iin}
              onChange={handleChange}
              className="p-3 border border-[#48887B] rounded-3xl w-full"
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
              className="p-3 border border-[#48887B] rounded-3xl w-full"
              required
            />
            <label>Дата смерти:</label>
            <input
              type="date"
              name="death_date"
              value={person.death_date}
              onChange={handleChange}
              className="p-3 border border-[#48887B] rounded-3xl w-full"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl text-[#48887B] font-bold mb-8 text-center">
          Место захоронения
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <select
            name="country"
            value={person.country}
            onChange={handleChange}
            className="p-3 border border-[#48887B] rounded-3xl bg-white text-gray-700 appearance-none w-full"
            required>
            <option value="">Выберите страну</option>
            <option value="Австралия">Австралия</option>
            <option value="Австрия">Австрия</option>
            <option value="Азербайджан">Азербайджан</option>
            <option value="Албания">Албания</option>
            <option value="Алжир">Алжир</option>
            <option value="Ангола">Ангола</option>
            <option value="Андорра">Андорра</option>
            <option value="Антигуа и Барбуда">Антигуа и Барбуда</option>
            <option value="Аргентина">Аргентина</option>
            <option value="Армения">Армения</option>
            <option value="Афганистан">Афганистан</option>
            <option value="Бангладеш">Бангладеш</option>
            <option value="Барбадос">Барбадос</option>
            <option value="Бахрейн">Бахрейн</option>
            <option value="Беларусь">Беларусь</option>
            <option value="Белиз">Белиз</option>
            <option value="Бельгия">Бельгия</option>
            <option value="Бенин">Бенин</option>
            <option value="Болгария">Болгария</option>
            <option value="Боливия">Боливия</option>
            <option value="Босния и Герцеговина">Босния и Герцеговина</option>
            <option value="Ботсвана">Ботсвана</option>
            <option value="Бразилия">Бразилия</option>
            <option value="Бруней">Бруней</option>
            <option value="Буркина-Фасо">Буркина-Фасо</option>
            <option value="Бурунди">Бурунди</option>
            <option value="Бутан">Бутан</option>
            <option value="Вануату">Вануату</option>
            <option value="Великобритания">Великобритания</option>
            <option value="Венгрия">Венгрия</option>
            <option value="Венесуэла">Венесуэла</option>
            <option value="Вьетнам">Вьетнам</option>
            <option value="Габон">Габон</option>
            <option value="Гаити">Гаити</option>
            <option value="Гайана">Гайана</option>
            <option value="Гамбия">Гамбия</option>
            <option value="Гана">Гана</option>
            <option value="Гватемала">Гватемала</option>
            <option value="Гвинея">Гвинея</option>
            <option value="Гвинея-Бисау">Гвинея-Бисау</option>
            <option value="Германия">Германия</option>
            <option value="Гондурас">Гондурас</option>
            <option value="Гренада">Гренада</option>
            <option value="Греция">Греция</option>
            <option value="Грузия">Грузия</option>
            <option value="Дания">Дания</option>
            <option value="Джибути">Джибути</option>
            <option value="Доминика">Доминика</option>
            <option value="Доминиканская Республика">Доминиканская Республика</option>
            <option value="Египет">Египет</option>
            <option value="Замбия">Замбия</option>
            <option value="Зимбабве">Зимбабве</option>
            <option value="Израиль">Израиль</option>
            <option value="Индия">Индия</option>
            <option value="Индонезия">Индонезия</option>
            <option value="Иордания">Иордания</option>
            <option value="Ирак">Ирак</option>
            <option value="Иран">Иран</option>
            <option value="Ирландия">Ирландия</option>
            <option value="Исландия">Исландия</option>
            <option value="Испания">Испания</option>
            <option value="Италия">Италия</option>
            <option value="Казахстан">Казахстан</option>
            <option value="Камбоджа">Камбоджа</option>
            <option value="Камерун">Камерун</option>
            <option value="Канада">Канада</option>
            <option value="Катар">Катар</option>
            <option value="Кения">Кения</option>
            <option value="Кипр">Кипр</option>
            <option value="Киргизия">Киргизия</option>
            <option value="Китай">Китай</option>
            <option value="Колумбия">Колумбия</option>
            <option value="Коморы">Коморы</option>
            <option value="Конго">Конго</option>
            <option value="Коста-Рика">Коста-Рика</option>
            <option value="Куба">Куба</option>
            <option value="Кувейт">Кувейт</option>
            <option value="Лаос">Лаос</option>
            <option value="Латвия">Латвия</option>
            <option value="Лесото">Лесото</option>
            <option value="Либерия">Либерия</option>
            <option value="Ливан">Ливан</option>
            <option value="Ливия">Ливия</option>
            <option value="Литва">Литва</option>
            <option value="Лихтенштейн">Лихтенштейн</option>
            <option value="Люксембург">Люксембург</option>
            <option value="Маврикий">Маврикий</option>
            <option value="Мавритания">Мавритания</option>
            <option value="Мадагаскар">Мадагаскар</option>
            <option value="Малайзия">Малайзия</option>
            <option value="Мальдивы">Мальдивы</option>
            <option value="Мальта">Мальта</option>
            <option value="Марокко">Марокко</option>
            <option value="Мексика">Мексика</option>
            <option value="Мозамбик">Мозамбик</option>
            <option value="Молдова">Молдова</option>
            <option value="Монако">Монако</option>
            <option value="Монголия">Монголия</option>
            <option value="Намибия">Намибия</option>
            <option value="Непал">Непал</option>
            <option value="Нигер">Нигер</option>
            <option value="Нигерия">Нигерия</option>
            <option value="Нидерланды">Нидерланды</option>
            <option value="Никарагуа">Никарагуа</option>
            <option value="Новая Зеландия">Новая Зеландия</option>
            <option value="Норвегия">Норвегия</option>
            <option value="ОАЭ">ОАЭ</option>
            <option value="Оман">Оман</option>
            <option value="Пакистан">Пакистан</option>
            <option value="Панама">Панама</option>
            <option value="Парагвай">Парагвай</option>
            <option value="Перу">Перу</option>
            <option value="Польша">Польша</option>
            <option value="Португалия">Португалия</option>
            <option value="Россия">Россия</option>
            <option value="Руанда">Руанда</option>
            <option value="Румыния">Румыния</option>
            <option value="Саудовская Аравия">Саудовская Аравия</option>
            <option value="Северная Македония">Северная Македония</option>
            <option value="Сенегал">Сенегал</option>
            <option value="Сербия">Сербия</option>
            <option value="Сингапур">Сингапур</option>
            <option value="Сирия">Сирия</option>
            <option value="Словакия">Словакия</option>
            <option value="Словения">Словения</option>
            <option value="США">США</option>
            <option value="Таджикистан">Таджикистан</option>
            <option value="Таиланд">Таиланд</option>
            <option value="Танзания">Танзания</option>
            <option value="Тунис">Тунис</option>
            <option value="Туркменистан">Туркменистан</option>
            <option value="Турция">Турция</option>
            <option value="Уганда">Уганда</option>
            <option value="Узбекистан">Узбекистан</option>
            <option value="Украина">Украина</option>
            <option value="Уругвай">Уругвай</option>
            <option value="Фиджи">Фиджи</option>
            <option value="Филиппины">Филиппины</option>
            <option value="Финляндия">Финляндия</option>
            <option value="Франция">Франция</option>
            <option value="Хорватия">Хорватия</option>
            <option value="Черногория">Черногория</option>
            <option value="Чехия">Чехия</option>
            <option value="Чили">Чили</option>
            <option value="Швейцария">Швейцария</option>
            <option value="Швеция">Швеция</option>
            <option value="Шри-Ланка">Шри-Ланка</option>
            <option value="Эквадор">Эквадор</option>
            <option value="Эстония">Эстония</option>
            <option value="Эфиопия">Эфиопия</option>
            <option value="ЮАР">ЮАР</option>
            <option value="Южная Корея">Южная Корея</option>
            <option value="Ямайка">Ямайка</option>
            <option value="Япония">Япония</option>
          </select>
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
          <button
            type="submit"
            disabled={isClicked}
            className={`px-10 py-5 text-xl rounded-3xl transition text-white ${
              isClicked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#48887B] hover:bg-[#3a6f63]"
            }`}
          >
            {isClicked ? "Добавлено..." : "Добавить"}
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-6 text-center text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
}
