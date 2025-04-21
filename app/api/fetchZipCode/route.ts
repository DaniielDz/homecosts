// app/api/fetchZipCode/route.ts
import { supabase } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zipParam = searchParams.get('zip');

    if (!zipParam) {
      return NextResponse.json({ error: 'ZIP code is required' }, { status: 400 });
    }

    const zipCodeValue = parseInt(zipParam);

    if (isNaN(zipCodeValue)) {
      return NextResponse.json({ error: 'ZIP code is not a valid number' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('zipcodes_values')
      .select('value')
      .eq('zip_code', zipCodeValue)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: `Zip code ${zipCodeValue} not available` },
        { status: 404 }
      );
    }

    return NextResponse.json({ value: data.value });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
