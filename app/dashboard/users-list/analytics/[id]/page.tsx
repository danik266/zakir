"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import { useParams } from "next/navigation";

export default function AnalyticsPage() {
  const { id } = useParams();
  const [views, setViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViews = async () => {
      const { data, error } = await supabase
        .from("memorial_views")
        .select("*")
        .eq("memorial_id", id)
        .order("viewed_at", { ascending: false });

      if (error) console.error(error);
      else setViews(data || []);

      setLoading(false);
    };
    fetchViews();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white dark:bg-gray-800 rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Аналитика просмотров</h1>

      {views.length === 0 ? (
        <p className="text-gray-500 dark:text-white">Просмотры отсутствуют</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-gray-900 dark:text-white">Кто посмотрел</th>
              <th className="border-b p-2 text-gray-900 dark:text-white">Дата и время</th>
            </tr>
          </thead>
          <tbody>
            {views.map((view) => (
              <tr key={view.id} className="border-b">
                <td className="p-2 text-gray-700 dark:text-white">{view.viewer_name || "Гость"}</td>
                <td className="p-2 text-gray-700 dark:text-white">
                  {new Date(view.viewed_at).toLocaleString("ru-RU")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
