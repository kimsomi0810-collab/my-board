'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/cats/${postId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('삭제에 실패했습니다.');

      router.push('/');
      router.refresh();
    } catch (error) {
      alert('오류가 발생했습니다.');
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
    >
      {isDeleting ? '삭제 중...' : '🗑️ 삭제'}
    </button>
  );
}
