"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabaseClient";
import Image from "next/image";
import { X } from "lucide-react";
import photocam from "../../../../../public/photocam.svg";
import videocam from "../../../../../public/videocam.svg";

export default function EditMemorial() {
  const { id } = useParams();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    iin: "",
    birth_date: "",
    death_date: "",
    religion: "",
    country: "",
    city: "",
    address: "",
    place_url: "",
    description: "",
  });

  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  useEffect(() => {
    const getUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("session error:", error);
      const email = data?.session?.user?.email ?? null;
      setCurrentUserEmail(email);
      console.log("current user email:", email);
    };
    getUserSession();
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadMemorial = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("memorials")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("load memorial error:", error);
        setLoading(false);
        return;
      }

      setUser(data);

      setFormData({
        full_name: data.full_name ?? "",
        iin: data.iin ?? "",
        birth_date: data.birth_date ?? "",
        death_date: data.death_date ?? "",
        religion: data.religion ?? "",
        country: data.country ?? "",
        city: data.city ?? "",
        address: data.address ?? "",
        place_url: data.place_url ?? "",
        description: data.description ?? "",
      });

      const parseFieldToArray = (val: any): string[] => {
        if (!val) return [];
        try {
          const parsed = typeof val === "string" ? JSON.parse(val) : val;
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return typeof val === "string" ? [val] : [];
        }
      };

      setPhotoPreviews(parseFieldToArray(data.photo_url));
      setVideoPreviews(parseFieldToArray(data.video_url));

      setLoading(false);
    };

    loadMemorial();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Загрузка...</p>;
  if (!user) return <p className="text-center mt-10">Мемориал не найден.</p>;
  if (currentUserEmail && currentUserEmail !== user.created_by_email)
    return (
      <p className="text-center mt-10 text-red-500">
        У вас нет прав на редактирование этого мемориала.
      </p>
    );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function uploadFilesToBucket(bucket: string, files: FileList) {
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const safeName = file.name
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "")
        .toLowerCase();

      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const uploaded = await uploadFilesToBucket("photos", files);
      if (uploaded.length === 0) {
        alert("Не удалось загрузить фото. Проверь консоль.");
        return;
      }
      const updated = [...photoPreviews, ...uploaded];
      setPhotoPreviews(updated);
      const { error } = await supabase
        .from("memorials")
        .update({ photo_url: JSON.stringify(updated) })
        .eq("id", id);
      if (error) console.error("update photo_url error:", error);
    } catch (err) {
      console.error("handlePhotoChange unexpected:", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = photoPreviews.filter((_, i) => i !== index);
    setPhotoPreviews(updated);
    const { error } = await supabase
      .from("memorials")
      .update({ photo_url: JSON.stringify(updated) })
      .eq("id", id);
    if (error) console.error("remove photo update error:", error);
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const uploaded = await uploadFilesToBucket("videos", files);
      if (uploaded.length === 0) {
        alert("Не удалось загрузить видео. Проверь консоль.");
        return;
      }
      const updated = [...videoPreviews, ...uploaded];
      setVideoPreviews(updated);
      const { error } = await supabase
        .from("memorials")
        .update({ video_url: JSON.stringify(updated) })
        .eq("id", id);
      if (error) console.error("update video_url error:", error);
    } catch (err) {
      console.error("handleVideoChange unexpected:", err);
    } finally {
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  // --- Удаление видео ---
  const handleRemoveVideo = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = videoPreviews.filter((_, i) => i !== index);
    setVideoPreviews(updated);
    const { error } = await supabase
      .from("memorials")
      .update({ video_url: JSON.stringify(updated) })
      .eq("id", id);
    if (error) console.error("remove video update error:", error);
  };

  // --- Сохранение формы ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsClicked(true);

    const payload = {
      ...formData,
      photo_url: JSON.stringify(photoPreviews),
      video_url: JSON.stringify(videoPreviews),
    };

    const { error } = await supabase.from("memorials").update(payload).eq("id", id);
    if (error) {
      console.error("submit update error:", error);
      alert("Ошибка при обновлении данных. См. консоль.");
      setIsClicked(false);
      return;
    }

    alert("Изменения успешно сохранены!");
    router.push(`/dashboard/users-list/${id}`);
  };

  // --- UI ---
  return (
    <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl sm:text-4xl text-[#48887B] font-bold mb-10 text-center">
          Редактировать мемориальную страницу
        </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input
          type="text"
          name="full_name"
          placeholder="ФИО"
          value={formData.full_name}
          onChange={handleChange}
          className="p-3 border border-[#48887B] rounded-3xl w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Описание"
          value={formData.description}
          onChange={handleChange}
          className="p-3 border border-[#48887B] rounded-3xl w-full h-40 resize-none"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label>Дата рождения:</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className="p-3 border border-[#48887B] rounded-3xl w-full"
              required
            />
          </div>

          <div>
            <label>Дата смерти:</label>
            <input
              type="date"
              name="death_date"
              value={formData.death_date}
              onChange={handleChange}
              className="p-3 border border-[#48887B] rounded-3xl w-full"
              required
            />
          </div>
        </div>
        <select
          name="religion"
          value={formData.religion}
          onChange={handleChange}
          className="p-3 border border-[#48887B] rounded-3xl w-full"
          required
        >
          <option value="">Выберите религию</option>
          <option value="Ислам">Ислам</option>
          <option value="Христианство">Христианство</option>
          <option value="Православие">Православие</option>
        </select>
        <h1 className="text-2xl sm:text-4xl text-[#48887B] font-bold mb-8 text-center">
          Место захоронения
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="p-3 border border-[#48887B] rounded-3xl w-full"
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
            value={formData.city}
            onChange={handleChange}
            className="p-3 border border-[#48887B] rounded-3xl w-full"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Адрес"
            value={formData.address}
            onChange={handleChange}
            className="p-3 border border-[#48887B] rounded-3xl w-full"
            required
          />
          <input
            type="url"
            name="place_url"
            placeholder="Ссылка на место (2GIS, Yandex Map, Google Maps)"
            value={formData.place_url}
            onChange={handleChange}
            className="p-3 border border-[#48887B] rounded-3xl w-full"
            required
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Фото</h3>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-[#48887B] rounded-xl p-4 flex flex-wrap gap-3 cursor-pointer"
          >
            {photoPreviews.length > 0 ? (
              photoPreviews.map((src, i) => (
                <div key={i} className="relative w-28 h-28">
                  <img
                    src={src}
                    alt={`photo-${i}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleRemovePhoto(i, e)}
                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              ))
            ) : (
              <Image src={photocam} width={100} height={100} alt="add photo" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
  Нажмите на пустое поле, чтобы добавить ещё фото
</p>

        </div>
        <div>
          <h3 className="font-semibold mb-2">Видео</h3>
          <div
            onClick={() => videoInputRef.current?.click()}
            className="border-2 border-[#48887B] rounded-xl p-4 flex flex-wrap gap-3 cursor-pointer"
          >
            {videoPreviews.length > 0 ? (
              videoPreviews.map((src, i) => (
                <div key={i} className="relative w-full max-w-[300px]">
                  <video src={src} controls className="rounded-xl w-full" />
                  <button
                    type="button"
                    onClick={(e) => handleRemoveVideo(i, e)}
                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              ))
            ) : (
              <Image src={videocam} width={100} height={100} alt="add video" />
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500  text-center mt-2">
  Нажмите на пустое поле, чтобы добавить ещё видео
</p>

        </div>
        <button
          type="submit"
          disabled={isClicked}
          className={`w-full py-4 rounded-3xl text-white text-lg font-semibold transition ${
            isClicked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#48887B] hover:bg-[#3a6b63]"
          }`}
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}
