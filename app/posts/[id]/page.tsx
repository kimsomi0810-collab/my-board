import Link from 'next/link';
import { notFound } from 'next/navigation';
import pool from '@/lib/db';
import DeleteButton from './DeleteButton';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (error) {
    console.error('DB Error:', error);
    return null;
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/" className="text-gray-600 hover:text-gray-800">
          ← 목록으로
        </Link>
      </div>

      <article className="border rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-3">{post.title}</h1>

        <div className="flex gap-3 text-sm text-gray-500 pb-4 mb-4 border-b">
          <span>👤 {post.author}</span>
          <span>🕒 {new Date(post.created_at).toLocaleString('ko-KR')}</span>
        </div>

        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post.content}
        </div>
      </article>

      <div className="flex gap-2 justify-end mt-4">
        <Link
          href={`/posts/${post.id}/edit`}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          ✏️ 수정
        </Link>
        <DeleteButton postId={post.id} />
      </div>
    </div>
  );
}
