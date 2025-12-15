import { NextResponse } from 'next/server';
import { Batch } from '@/lib/types';

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export async function GET(request: Request) {
  const batches: Batch[] = [];
  const startYear = 2010;
  const numberOfBatches = 16;

  for (let i = 0; i < numberOfBatches; i++) {
    const year = startYear + i;
    const batchNumber = i + 1;
    batches.push({
      value: year.toString(),
      label: `${getOrdinal(batchNumber)} Batch (${year})`,
    });
  }

  return NextResponse.json(batches);
}
