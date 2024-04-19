'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation'
import Sidebar from "@/app/components/Sidebar";
import { useCallback, useState } from "react";

export default function Navbar() {
  const router = useRouter()

  const [sidebarOpen, setSidebarOpen] = useState<boolean | null>(false);

  const showSidebar = useCallback(()=>{
    setSidebarOpen(!sidebarOpen)
  },[sidebarOpen])

  return (
  <div className="flex mb-12" >
    <Sidebar isSidebarOpen={sidebarOpen ?? false} />
    <Image
      className="cursor-pointer absolute top-2 left-2 z-50"
      src="/menu.png"
      alt="welcome"
      width={20}
      height={20}
      priority
      onClick={() => showSidebar()}
    />
    <button
      className="absolute bg-backg-inputs-red rounded-inputs py-1 px-5 right-3 top-6 z-50"
      onClick={() => router.push('/')}
    >{/* Cerrar Sesión */}
    </button>

    <button
      className="absolute bg-backg-inputs-submit rounded-inputs py-1 px-5 right-3 top-2 z-50"
      onClick={() => router.push('/pages/main')}
    >{/* Inicio */}
    </button>
  </div>
  )
}