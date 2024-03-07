'use client';

import Image from "next/image";

export default function Buzon({ item = "", fecha = "", contenido = "" }) {
  return (
    <div className="relative flex flex-col bg-backg-container-blue rounded-inputs p-3 mt-3 w-48 min-[320px]:w-18 md:w-96">

      <div className="relative flex flex-row place-items-center justify-between">
        <h5 className="relative place-items-left text-xs">{item}</h5>
        <h5 className="relative place-items-rigth text-dates">{fecha}</h5>
      </div>

      <div className="flex flex-col bg-background-main-page place-items-center justify-center rounded mt-2 h-16 ">
        <div className="flex flex-col relative place-items-center">
          <h5 className="flex text-center md:text-center text-xs">{contenido}</h5>
        </div>
      </div>
      <Image
        className="cursor-pointer absolute bottom-2 right-2 z-30"
        src="/borrar.png"
        alt="delete"
        width={20}
        height={20}
        priority
        onClick={() => {}}
      />
    </div>
  )
}
