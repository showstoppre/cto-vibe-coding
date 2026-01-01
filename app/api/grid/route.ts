import { NextRequest, NextResponse } from 'next/server';

const GRID_SIZE = 10;
const DEFAULT_COLOR = '#ffffff';

const gridState: string[][] = Array(GRID_SIZE)
  .fill(null)
  .map(() => Array(GRID_SIZE).fill(DEFAULT_COLOR));

export async function GET() {
  return NextResponse.json({ grid: gridState });
}

export async function POST(request: NextRequest) {
  try {
    const { row, col, color } = await request.json();

    if (
      row < 0 ||
      row >= GRID_SIZE ||
      col < 0 ||
      col >= GRID_SIZE
    ) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    gridState[row][col] = color;

    return NextResponse.json({ success: true, grid: gridState });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
