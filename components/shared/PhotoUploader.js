import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // проверь путь

export default function PhotoUploader({ onUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));

      setUploading(true);

      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from('avatars') // твой bucket
        .upload(fileName, file);

      if (error) {
        console.error('Ошибка загрузки:', error.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        onUpload(publicUrlData.publicUrl);
      }

      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <label
        htmlFor="fileInput"
        style={{
          cursor: uploading ? 'not-allowed' : 'pointer',
          display: 'inline-block',
          padding: '20px',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          opacity: uploading ? 0.6 : 1,
          pointerEvents: uploading ? 'none' : 'auto',
        }}
      >
        <div style={{ fontSize: '50px' }}>📷</div>
        <div>{uploading ? 'Загрузка...' : 'Нажми чтобы выбрать фото'}</div>
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
        disabled={uploading}
      />

      {selectedImage && (
        <div style={{ marginTop: '20px' }}>
          <img
            src={selectedImage}
            alt="Выбранное фото"
            style={{ maxWidth: '300px', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  );
}
