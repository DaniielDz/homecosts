// app/[category]/[calculator]/layout.tsx
import { ReactNode } from 'react'
import { Metadata } from 'next'
import { supabase } from '@/app/lib/supabase'

/** Solo para el layout component */
interface LayoutProps {
    children: ReactNode
    params: {
        category: string
        calculator: string
    }
}

/** Solo para generateMetadata */
interface GenMetaContext {
    params: {
        category: string
        calculator: string
    }
}

export async function generateMetadata(
    { params }: GenMetaContext
): Promise<Metadata> {
    const { calculator } = params

    const { data: baseData } = await supabase
        .from('calculators')
        .select('name, slug, title')
        .eq('slug', calculator)
        .single()

    if (!baseData) {
        return {
            title: 'HomeCosts',
            description: 'Free cost calculator',
        }
    }

    return {
        title: `${baseData.title} — Free Calculator`,
        description: `Estimates for ${baseData.title}`,
    }
}

export default function CalculatorLayout({
    children,
    params,
}: LayoutProps) {
    // ahora params y children tienen el tipo correcto,
    // y no hay conflicto con LayoutProps interno de Next.
    return <>{children}</>
}
