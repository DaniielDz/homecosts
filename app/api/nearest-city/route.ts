// app/api/nearest-city/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function POST(req: NextRequest) {
  const { latitude, longitude } = await req.json()

  const { data, error } = await supabase
    .rpc('find_nearest_city', {
      lat_input: latitude,
      lon_input: longitude,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data || (Array.isArray(data) && data.length === 0)) {
    // sin ciudad cercana
    return NextResponse.json(null)
  }

  // data puede ser un objeto o array de uno
  const cityData = Array.isArray(data) ? data[0] : data
  return NextResponse.json(cityData)
}
