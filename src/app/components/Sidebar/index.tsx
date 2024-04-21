'use client';

// import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, useContext } from "react";
import { infoContext } from "../../hooks/AuthHook";


export default function Sidebar({ isSidebarOpen = false }) {
  const router = useRouter()
  const { setInfoLogout } = useContext(infoContext);
  

  const cerrarSesion = () => {
    setInfoLogout({ isSignedIn: false });
  }

  return (

    <div className={`flex flex-col absolute justify-beetwen place-items-center  bg-backg-container-gray ${isSidebarOpen ? '' : 'hidden'} gap-4 top-0 left-0 w-48 max-[360px]:w-full md:w-86 h-full z-40 `}>
      {/* <Image
        className="cursor-pointer z-50"
        src="/undraw_Profile_pic_re_iwgo.png"
        alt="welcome"
        width={20}
        height={20}
        priority
        onClick={() => router.push('/pages/main')}
      /> */}
      <button
        className="flex justify-center place-items-center text-center bg-backg-container-blue rounded-inputs py-1 px-5 mt-20 w-40"
        onClick={() => router.push('/pages/notas')}
      >Notas
      </button>
      <button
        className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
        onClick={() => router.push('/pages/cursos')}
      >Cursos
      </button>
      <button
        className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40 "
        onClick={() => router.push('/pages/buzon')}
      >Buzon
      </button>
      <button
        className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
        onClick={() => router.push('/pages/contactos')}
      >Contactos
      </button>

      <button
        className="flex justify-center bg-backg-inputs-red rounded-inputs py-1 px-5 w-40 mt-auto mb-10"
        // className="absolute bg-backg-inputs-red rounded-inputs py-1 px-5 right-3 top-12 z-50"
        onClick={() => cerrarSesion()}
      >Cerrar Sesión
      </button>
    </div>
  )
}
// export default Sidebar;