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
    </section>
  )
}