import Link from 'next/link';
import pool from '@/lib/db';

interface Cat {
  id: number;
  name: string;
  image_url: string;
  description: string;
  likes: number;
  created_at: string;
}

async function getCats(sortBy: string): Promise<Cat[]> {
  const orderBy =
    sortBy === 'likes'
      ? 'likes DESC, id DESC'
      : 'created_at DESC, id DESC';

  const result = await pool.query(
    `SELECT * FROM cats ORDER BY ${orderBy}`
  );
  return result.rows;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const params = await searchParams;
  const sortBy = params.sort || 'recent';
  const cats = await getCats(sortBy);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">📸 뉴턴 & 에디슨의 순간 포착</h1>
        <Link
          href="/posts/new"
          className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          ✏️ 추가하기
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <Link
          href="/?sort=recent"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            sortBy === 'recent'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🆕 최신순
        </Link>
        <Link
          href="/?sort=likes"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            sortBy === 'likes'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ❤️ 인기순
        </Link>
      </div>

      {cats.length === 0 ? (
        <p className="text-center text-gray-500 py-20">
          아직 등록된 고양이가 없어요 🐾
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((cat) => (
            <Link
              key={cat.id}
              href={`/posts/${cat.id}`}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-1">{cat.name}</h2>
                {cat.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {cat.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-pink-500">
                  <span>❤️</span>
                  <span className="font-medium">{cat.likes}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}