'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, useContext } from "react";
import { infoContext } from "../../hooks/AuthHook";
import TipoUsuarios from "../../utils/enum";


export default function Sidebar({ isSidebarOpen = false, showSidebar = () => { } }) {
  const router = useRouter()
  const { getInfo, setInfoLogout } = useContext(infoContext);
  const [InfoUser, setInfoUser] = useState<any>({});

  const cerrarSesion = () => {
    setInfoLogout({ isSignedIn: false });
    localStorage.getItem("userLogin") == "false"
  }
  const onChangeRoutes = (route: string) => {
    showSidebar()
    router.push(route)
  }

  useEffect(() => {
    let res: any = getInfo()
    setInfoUser(res ?? {})
  }, [getInfo])

  return (
    <div className={`flex flex-col fixed justify-beetwen place-items-center  bg-backg-container-gray ${isSidebarOpen ? '' : 'hidden'} gap-4 w-48 max-[360px]:w-full md:w-86 h-screen z-40 `}>
      <h5 className="relative place-items-left text-xs my-8">{InfoUser?.userInfo?.nombre_usuario ?? ""}</h5>
      <Image
        className="rounded-full cursor-pointer z-50"
        src="/undraw_Profile_pic_re_iwgo.png"
        alt="welcome"
        width={140}
        height={150}
        priority
        onClick={() => onChangeRoutes('/pages/main')}
      />
      <div className="py-1 px-5 mt-10 w-40"></div>
      {[TipoUsuarios.ESTUDIANTE].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") && (
        <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          onClick={() => onChangeRoutes('/pages/notas')}
        >Notas
        </button>
      )}
      <button
        className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
        onClick={() => onChangeRoutes('/pages/materias')}
      >Materias
      </button>
      {[TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") && (
        <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          onClick={() => onChangeRoutes('/pages/cursos')}
        >Cursos
        </button>
      )}
      {(InfoUser?.roleInfo?.tipo_usuario ?? "") == TipoUsuarios.ADMINISTRADOR && (
        <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          onClick={() => onChangeRoutes('/pages/users')}
        >Usuarios
        </button>
      )}
      {/* <button
        className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40 "
        onClick={() => onChangeRoutes('/pages/buzon')}
      >Buzon
      </button>
      <button
        className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
        onClick={() => onChangeRoutes('/pages/contactos')}
      >Contactos
      </button> */}

      <button
        className="flex justify-center bg-backg-inputs-red rounded-inputs py-1 px-5 w-40 mt-auto"
        // className="absolute bg-backg-inputs-red rounded-inputs py-1 px-5 right-3 top-12 z-50"
        onClick={() => onChangeRoutes(`/pages/users/gestion?pk_id_usuario=${InfoUser?.userInfo?.id_usuario ?? "0"}`)}
      >Configuracion
      </button>
      <button
        className="flex justify-center bg-backg-inputs-red rounded-inputs py-1 px-5 w-40 mb-10"
        // className="absolute bg-backg-inputs-red rounded-inputs py-1 px-5 right-3 top-12 z-50"
        onClick={() => cerrarSesion()}
      >Cerrar Sesión
      </button>
    </div>
  )
}