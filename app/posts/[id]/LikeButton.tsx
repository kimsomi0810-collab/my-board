'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LikeButton({
  catId,
  initialLikes,
}: {
  catId: number;
  initialLikes: number;
}) {
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [isClicking, setIsClicking] = useState(false);

  const handleLike = async () => {
    if (isClicking) return;
    setIsClicking(true);

    // 즉시 화면에 반영 (사용자 경험 ↑)
    setLikes(likes + 1);

    try {
      const res = await fetch(`/api/cats/${catId}/like`, {
        method: 'POST',
      });

      if (!res.ok) {
        // 실패하면 원래대로 복구
        setLikes(likes);
        alert('좋아요 실패');
      } else {
        // 성공하면 다른 페이지에서도 반영되게
        router.refresh();
      }
    } catch (error) {
      setLikes(likes);
      console.error(error);
    } finally {
      setIsClicking(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isClicking}
      className="flex items-center gap-2 px-5 py-2 rounded-full bg-pink-50 hover:bg-pink-100 disabled:opacity-50 transition-colors"
    >
      <span className="text-2xl">❤️</span>
      <span className="text-lg font-bold text-pink-600">{likes}</span>
    </button>
  );
}