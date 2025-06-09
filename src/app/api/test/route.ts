import { db } from '@/lib/db';
import { columns } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.select().from(columns);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
} 