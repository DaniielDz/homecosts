import { ReactNode } from 'react'
import { Metadata } from 'next'
import { supabase } from '@/app/lib/supabase'

interface GenMetaContext {
  params: Promise<{
    category: string
    calculator: string
  }>
}

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
}: LayoutContext) {

  return (
    <>
      {children}
    </>
  )
}
