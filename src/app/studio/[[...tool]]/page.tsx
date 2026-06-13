'use client'

import dynamic from 'next/dynamic'
import config from '../../../../sanity.config'

// Esto fuerza a Next.js a cargar Sanity SOLO en el navegador, evitando el choque en Vercel
const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { ssr: false }
)

export default function StudioPage() {
  return <NextStudio config={config} />
}