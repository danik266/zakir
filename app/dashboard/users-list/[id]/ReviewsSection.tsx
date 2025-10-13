"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  user_name: string;
  message: string;
  created_at: string;
}

export default function ReviewsSection({ memorialId }: { memorialId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [memorialId]);

  async function fetchReviews() {
    const { data, error } = await supabase
      .from("user_reviews")
      .select("*")
      .eq("memorial_id", memorialId)
      .order("created_at", { ascending: false });

    if (!error && data) setReviews(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userName.trim() || !message.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("user_reviews").insert([
      {
        memorial_id: memorialId,
        user_name: userName,
        message,
      },
    ]);
    setLoading(false);

    if (!error) {
      setUserName("");
      setMessage("");
      fetchReviews();
    } else {
      console.error("Ошибка при добавлении:", error);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3 dark:bg-gray-900" 
      >
        <input
          type="text"
          placeholder="Ваше имя"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border rounded-lg p-2 text-gray-800 dark:text-white"
        />
        <textarea
          placeholder="Ваши слова памяти..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-lg p-2 text-gray-800 dark:text-white"
          rows={3}
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#48887B] hover:bg-[#3b7369] text-white w-full ">
          {loading ? "Отправка..." : "Оставить слова памяти"}
        </Button>
      </form>
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            Слов памяти пока нет.
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="bg-gray-50 border-l-4 border-[#48887B] p-5 rounded-xl shadow-sm italic text-gray-700 leading-relaxed dark:bg-gray-900"
            >
              <div className="flex justify-between items-center mb-2 ">
                <p className="font-semibold text-gray-900 dark:text-white">{r.user_name}</p>
                <p className="text-sm text-gray-400">
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{r.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
