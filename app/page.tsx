import Link from 'next/link';
import pool from '@/lib/db';

interface Post {
  id: number;
  title: string;
  author: string;
  created_at: string;
}

async function getPosts(): Promise<Post[]> {
  const result = await pool.query(
    'SELECT id, title, author, created_at FROM posts ORDER BY created_at DESC'
  );
  return result.rows;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📋 게시판</h1>
        <Link
          href="/posts/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          ✏️ 글쓰기
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {posts.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            아직 작성된 글이 없습니다.
          </p>
        ) : (
          <ul className="divide-y">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.id}`}
                  className="block p-4 hover:bg-gray-50"
                >
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    <span>👤 {post.author}</span>
                    <span>
                      🕒 {new Date(post.created_at).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
