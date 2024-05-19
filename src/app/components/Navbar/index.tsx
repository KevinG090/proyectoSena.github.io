'use client';

import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()



  return (
  <div className="flex mb-12" >
    <button
      className="absolute bg-backg-inputs-submit rounded-inputs py-1 px-5 right-3 top-2 z-50"
      onClick={() => router.push('/pages/main')}
    >Inicio
    </button>
  </div>
  )
}