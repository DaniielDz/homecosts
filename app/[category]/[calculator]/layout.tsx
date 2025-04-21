// app/[category]/[calculator]/layout.tsx
import { ReactNode } from 'react'
import { Metadata } from 'next'
import { supabase } from '@/app/lib/supabase'

interface Props {
    children: ReactNode
    params: { category: string; calculator: string }
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const calculatorSlug = resolvedParams.calculator;

    const { data: baseData } = await supabase
        .from('calculators')
        .select('name, slug, title')
        .eq('slug', calculatorSlug)
        .single()

    if (!baseData) {
        return { title: 'HomeCosts', description: 'Free cost calculator' }
    }

    const title = `${baseData.title} — Free Calculator`
    return { title, description: `Estimates for ${baseData.title}` }
}

export default function CalculatorLayout({ children }: Props) {
    return <>{children}</>
}
