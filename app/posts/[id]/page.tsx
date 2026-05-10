import Link from 'next/link';
import { notFound } from 'next/navigation';
import pool from '@/lib/db';
import DeleteButton from './DeleteButton';
import LikeButton from './LikeButton';

interface Cat {
  id: number;
  name: string;
  image_url: string;
  description: string;
  likes: number;
  created_at: string;
  updated_at: string;
}

async function getCat(id: string): Promise<Cat | null> {
  try {
    const result = await pool.query(
      'SELECT * FROM cats WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (error) {
    console.error('DB Error:', error);
    return null;
  }
}

export default async function CatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCat(id);

  if (!cat) notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/" className="text-gray-600 hover:text-gray-800">
          ← 도감으로 돌아가기
        </Link>
      </div>

      <article className="border rounded-2xl overflow-hidden bg-white">
        <div className="aspect-square bg-gray-100">
          <img
            src={cat.image_url}
            alt={cat.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <h1 className="text-4xl font-bold mb-2">{cat.name}</h1>

          {cat.description && (
            <p className="text-gray-700 leading-relaxed mb-4">
              {cat.description}
            </p>
          )}

          <div className="flex items-center gap-4 pt-4 border-t">
            <LikeButton catId={cat.id} initialLikes={cat.likes} />
            <span className="text-sm text-gray-400 ml-auto">
              🕒 {new Date(cat.created_at).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>
      </article>

      <div className="flex gap-2 justify-end mt-4">
        <Link
          href={`/posts/${cat.id}/edit`}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          ✏️ 수정
        </Link>
        <DeleteButton postId={cat.id} />
      </div>
    </div>
  );
}