import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 고양이 한 마리 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query('SELECT * FROM cats WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '고양이를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Failed to fetch cat' }, { status: 500 });
  }
}

// 고양이 정보 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, image_url, description } = await request.json();

    if (!name || !image_url) {
      return NextResponse.json(
        { error: '이름과 사진 URL은 필수입니다.' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'UPDATE cats SET name = $1, image_url = $2, description = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [name, image_url, description || '', id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '고양이를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Failed to update cat' }, { status: 500 });
  }
}

// 고양이 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query('DELETE FROM cats WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '고양이를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Failed to delete cat' }, { status: 500 });
  }
}
