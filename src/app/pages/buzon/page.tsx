'use client';

import Buzon from "@/app/components/Buzon";
import Navbar from "@/app/components/Navbar";
import { useState } from "react";

export default function page() {

  const [events, setEvents] = useState([
    {item:"Buzon 1", fecha : "2024-02-05", contenido : "contenido del Buzon"},
    {item:"Buzon 2", fecha : "2024-01-02", contenido : "contenido del Buzon"},
    {item:"Buzon S", fecha : "2023-12-01", contenido : "contenido del Buzon"},
    {item:"Buzon 4", fecha : "2023-11-05", contenido : "contenido del Buzon"},
  ])
  
  return (
    <main className="main_page flex min-h-screen flex-col items-center">
      <Navbar/>
      <div className="relative flex flex-row bg-backg-container-blue place-items-center rounded-inputs px-6 py-1 mb-4">
          <h5 className="relative place-items-left text-xs">Buzon</h5>
      </div>
      <div className="flex flex-col place-items-center justify-between w-52">
        {
          events.map((val)=>{
            let items = val?.item ?? "Buzon General"
            let fecha = val?.fecha ?? ""
            let contenido = val?.contenido ?? "contenido del Buzon"
            return <Buzon item={items} fecha={fecha} contenido={contenido}/>
          })
        }
      </div >
    </main>
  );
  }
  