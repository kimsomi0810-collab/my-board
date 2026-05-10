import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 고양이 목록 조회
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM cats ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cats' },
      { status: 500 }
    );
  }
}

// 새 고양이 등록
export async function POST(request: NextRequest) {
  try {
    const { name, image_url, description } = await request.json();

    if (!name || !image_url) {
      return NextResponse.json(
        { error: '이름과 사진 URL은 필수입니다.' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO cats (name, image_url, description) VALUES ($1, $2, $3) RETURNING *',
      [name, image_url, description || '']
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json(
      { error: 'Failed to create cat' },
      { status: 500 }
    );
  }
}
