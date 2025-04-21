// app/[category]/[calculator]/layout.tsx
import { ReactNode } from 'react'
import { Metadata } from 'next'
import { supabase } from '@/app/lib/supabase'

/** Contexto para generateMetadata: params es Promise */
interface GenMetaContext {
  params: Promise<{
    category: string
    calculator: string
  }>
}

/** Contexto para Layout: params es Promise */
interface LayoutContext {
  children: ReactNode
  params: Promise<{
    category: string
    calculator: string
  }>
}

export async function generateMetadata(
  { params }: GenMetaContext
): Promise<Metadata> {
  const { calculator } = await params

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

export default async function CalculatorLayout({
  children,
  params,
}: LayoutContext) {
  // si necesitaras usar params aquí:
  // const { category, calculator } = await params

  return <>{children}</>
}
