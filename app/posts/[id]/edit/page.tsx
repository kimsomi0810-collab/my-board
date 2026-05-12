'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditCatPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    async function fetchCat() {
      try {
        const res = await fetch(`/api/cats/${id}`);
        if (!res.ok) throw new Error('불러오지 못했어요');
        const cat = await res.json();
        setName(cat.name);
        setImageUrl(cat.image_url);
        setDescription(cat.description || '');
      } catch (error) {
        alert('고양이 정보를 불러오지 못했어요');
        console.error(error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCat();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !imageUrl.trim()) {
      alert('이름과 사진 URL은 필수예요!');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/cats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          image_url: imageUrl,
          description,
        }),
      });

      if (!res.ok) throw new Error('수정에 실패했어요');

      router.push(`/posts/${id}`);
      router.refresh();
    } catch (error) {
      alert('오류가 발생했어요');
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-500">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">✏️ 내용 수정</h1>
        <Link href={`/posts/${id}`} className="text-gray-600 hover:text-gray-800">
          ← 상세로
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            사진 URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreviewError(false);
            }}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {imageUrl && !previewError && (
            <div className="mt-3 border rounded-lg overflow-hidden bg-gray-50">
              <p className="text-xs text-gray-600 px-3 py-1 bg-gray-100">
                미리보기:
              </p>
              <img
                src={imageUrl}
                alt="미리보기"
                className="w-full h-64 object-cover"
                onError={() => setPreviewError(true)}
              />
            </div>
          )}
          {previewError && (
            <p className="text-sm text-red-500 mt-2">
              ⚠️ 이미지를 불러올 수 없어요
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">한 줄 소개</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Link
            href={`/posts/${id}`}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg font-medium"
          >
            {isSubmitting ? '저장 중...' : '💾 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}