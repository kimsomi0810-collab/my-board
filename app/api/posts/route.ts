import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, author, content } = await request.json();

    if (!title || !author || !content) {
      return NextResponse.json(
        { error: '제목, 작성자, 내용을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO posts (title, author, content) VALUES ($1, $2, $3) RETURNING *',
      [title, author, content]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}