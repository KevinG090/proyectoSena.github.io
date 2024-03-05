'use client';

import Navbar from "@/app/components/Navbar/page";
import Event from "@/app/components/Events/page";

export default function page() {
  
  return (
    <main className="main_page flex min-h-screen flex-col items-center">
      <Navbar/>
      <div className="flex">
        <Event item="Evento 1" fecha="2024-03-05" contenido="contenido"/>

      </div >
    </main>
  );
}