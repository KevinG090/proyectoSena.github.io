'use client';

import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useCallback, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean | null>(false);

  const showSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  return (
    <section className="main_page flex min-h-screen flex-col ">
      <Navbar />
      <Sidebar isSidebarOpen={sidebarOpen ?? false} showSidebar={showSidebar} />
      <Image
        className="cursor-pointer fixed top-2 left-2 z-50"
        src="/menu.png"
        alt="welcome"
        width={20}
        height={20}
        priority
        onClick={() => showSidebar()}
      />
      {children}
      <Image
          className="cursor-pointer z-50 fixed bottom-2 right-2 rounded-full min-[600px]:w-[100px] min-[600px]:h-[100px] min-[200px]:w-[70px] h-[70px]"
          src="/logo.png"
          alt="logo"
          width={200}
          height={200}
          priority
        />
    </section>
  )
}