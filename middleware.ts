// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 1) Asegúrate de que corre en Edge:
export const config = {
    matcher: ['/:category/:calculator'],
    runtime: 'experimental-edge',
}

// 2) Inicializa supabase-js compatible con Edge:
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    {
        // pasar el fetch nativo de Edge
        global: { fetch }
    }
)

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const match = pathname.match(/^\/([^\/]+)\/([^\/]+)$/)
    if (!match) return NextResponse.next()
    const [, category, calculator] = match

    // ── Obtener lat/lng (dev vs prod) ────────────────────────
    // let latitude: number, longitude: number
    // if (process.env.NODE_ENV === 'development') {
    //     latitude = 55.7408
    //     longitude = -132.2564
    // } else {
    //     const latH = request.headers.get('x-vercel-ip-latitude')
    //     const lonH = request.headers.get('x-vercel-ip-longitude')
    //     latitude = latH ? parseFloat(latH) : NaN
    //     longitude = lonH ? parseFloat(lonH) : NaN
    // }
    const latH = request.headers.get('x-vercel-ip-latitude')
    const lonH = request.headers.get('x-vercel-ip-longitude')
    const latitude = latH ? parseFloat(latH) : NaN
    const longitude = lonH ? parseFloat(lonH) : NaN
    
    if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.next()
    }

    // ── Llamada directa a tu función RPC en Supabase ────────
    const { data, error } = await supabase
        .rpc('find_nearest_city', {
            lat_input: latitude,
            lon_input: longitude,
        })

    console.log("Lat/Lng:", latitude, longitude)
    console.log("RPC result:", data)
    console.log("RPC error:", error)

    // Si algo falla o no hay datos, seguimos sin redirigir.
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
        return NextResponse.next()
    }

    // data puede ser un objeto o un array con un único elemento
    const cityEntry = Array.isArray(data) ? data[0] : data
    const { city, state_abbreviation } = cityEntry

    // Construye el slug: "Holtsville-NY" → "holtsville-ny"
    const citySlug = `${city}-${state_abbreviation}`
        .toLowerCase()
        .replace(/\s+/g, '-')

    // ── Redireccionamos ─────────────────────────────────────
    const destination = `/${category}/${calculator}/${citySlug}`
    return NextResponse.redirect(new URL(destination, request.url))
}
