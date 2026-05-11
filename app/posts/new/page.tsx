'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCatPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !imageUrl.trim()) {
      alert('이름과 사진 URL은 필수예요!');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/cats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          image_url: imageUrl,
          description,
        }),
      });

      if (!res.ok) throw new Error('등록에 실패했어요.');

      router.push('/');
      router.refresh();
    } catch (error) {
      alert('오류가 발생했어요. 다시 시도해주세요.');
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">✏️ 추가하기</h1>
        <Link href="/" className="text-gray-600 hover:text-gray-800 font-bold">
        ⬅ 뒤로가기
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 즐거운 산책"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            placeholder="https://i.imgur.com/abc123.jpg"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 imgur.com에서 사진 올리고 우클릭 → "이미지 주소 복사"하세요
          </p>

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
              ⚠️ 이미지를 불러올 수 없어요. URL이 정확한지 확인해주세요.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">한 줄 설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예:키보드 위에 자주 누움"
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Link
            href="/"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            {isSubmitting ? '등록 중...' : '🐱 등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}