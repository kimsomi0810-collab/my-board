import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 좋아요 +1
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query(
      'UPDATE cats SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '고양이를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Failed to like cat' }, { status: 500 });
  }
}
