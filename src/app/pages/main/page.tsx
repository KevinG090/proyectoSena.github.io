'use client';

import Navbar from "@/app/components/Navbar";
import Event from "@/app/components/Events";
import { useState } from "react";

export default function page() {
  const [events, setEvents] = useState([
    {item:"Evento 1", fecha : "2024-03-05", contenido : "contenido"},
    {item:"Evento 2", fecha : "2024-02-02", contenido : "contenido"},
    {item:"Evento S", fecha : "2024-02-01", contenido : "contenido"},
    {item:"Evento Particurlar", fecha : "2024-01-05", contenido : "contenido"},
  ])
  
  return (
    <main className="main_page flex min-h-screen flex-col items-center">
      <Navbar/>
      <div className="relative flex flex-row bg-backg-container-blue place-items-center rounded-inputs px-6 py-1 mb-4">
          <h5 className="relative place-items-left text-xs">Eventos</h5>
      </div>
      <div className="flex flex-col place-items-center justify-between w-full">
        {
          events.map((val,index)=>{
            let items = val?.item ?? "Evento General"
            let fecha = val?.fecha ?? ""
            let contenido = val?.contenido ?? "contenido"
            return <Event key={index} item={items} fecha={fecha} contenido={contenido}/>
          })
        }
      </div >
    </main>
  );
}