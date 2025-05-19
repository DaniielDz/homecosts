import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const config = {
    matcher: ['/:category/:calculator'],
    runtime: 'experimental-edge',
}

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    {
        global: { fetch }
    }
)

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/favicon.ico') {
        return NextResponse.next()
    }

    const match = pathname.match(/^\/([^\/]+)\/([^\/]+)$/)
    if (!match) return NextResponse.next()
    const [, category, calculator] = match

    const latH = request.headers.get('x-vercel-ip-latitude')
    const lonH = request.headers.get('x-vercel-ip-longitude')
    const latitude = latH ? parseFloat(latH) : NaN
    const longitude = lonH ? parseFloat(lonH) : NaN

    if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.next()
    }

    const { data, error } = await supabase
        .rpc('find_nearest_city', {
            lat_input: latitude,
            lon_input: longitude,
        })

    if (error || !data || (Array.isArray(data) && data.length === 0)) {
        return NextResponse.next()
    }

    const cityEntry = Array.isArray(data) ? data[0] : data
    const { city, state_abbreviation } = cityEntry

    const citySlug = `${city}-${state_abbreviation}`
        .toLowerCase()
        .replace(/\s+/g, '-')

    const destination = `/${category}/${calculator}/${citySlug}`
    return NextResponse.redirect(new URL(destination, request.url))
}
