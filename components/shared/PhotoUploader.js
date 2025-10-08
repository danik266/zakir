"use client";
import { useState } from "react";
import Image from "next/image"; // ✅ используем next/image
import { supabase } from "@/lib/supabaseClient"; // ✅ путь ок, если папка "lib" в корне

export default function PhotoUploader({ onUpload }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setUploading(true);

      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage.from("avatars").upload(fileName, file);

      if (error) {
        console.error("Ошибка загрузки:", error.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        onUpload(publicUrlData.publicUrl);
      }

      setUploading(false);
    }
  };

  return (
    <div className="text-center relative">
      <label
        htmlFor="fileInput"
        className={`inline-block p-5 border-2 border-dashed rounded-lg transition ${
          uploading
            ? "opacity-60 cursor-not-allowed border-gray-300"
            : "cursor-pointer hover:border-[#48887B]"
        }`}
      >
        <div className="text-5xl">📷</div>
        <div>{uploading ? "Загрузка..." : "Нажми, чтобы выбрать фото"}</div>
      </label>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
        disabled={uploading}
      />

      {selectedImage && (
        <div className="mt-5 flex justify-center">
          <Image
            src={selectedImage}
            alt="Выбранное фото"
            width={300}
            height={300}
            className="rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  );
}
