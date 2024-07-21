'use client';

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, useContext } from "react";
import { fetchPostRequest } from "./utils/fetch"
import { urlLogin } from "./utils/routes"
import { notify, notifyError } from "./utils/notify"
import { cifrarAES } from "./utils/login"
import { infoContext } from "./hooks/AuthHook"

export default function FormLogin() {
  const router = useRouter()
  const { userInfo, updateUserInfo } = useContext(infoContext);

  const [loadingItems, setLoadingItems] = useState(false)
  const [infoUser, setInfoUser] = useState(null)

  const createInvoice = useCallback(async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);
    let items = Object.fromEntries(Object.entries(Object.fromEntries(formData)))
    let body = {
      data: cifrarAES(
        `${process.env.NEXT_PUBLIC_APP_LLAVE_AES_ENCRYPT}`,
        `${process.env.NEXT_PUBLIC_APP_IV_AES_ENCRYPT}`,
        items
      ),
    };

    try {
      const url = urlLogin()
      setLoadingItems(true)
      const { data } = await fetchPostRequest(url,body)
      // notify(data?.msg ?? "Consulta Exitosa")
      setInfoUser(false)
      setLoadingItems(false)
      localStorage.setItem("userLogin", true);
      localStorage.setItem("id_usuario",  data?.obj?.pk_id_usuario);
      updateUserInfo({
        isSignedIn: true,
        userInfo: {
          nombre_usuario: data?.obj?.nombre_usuario ?? "",
          id_usuario: data?.obj?.pk_id_usuario ?? null,
          nombre_tipo_usuario: data?.obj?.nombre_tipo_usuario ?? "",
          correo: data?.obj?.correo ?? "",
          identificacion: data?.obj?.identificacion ?? "",
          nombre_curso: data?.obj?.nombre_curso ?? "",
          pk_id_curso: data?.obj?.pk_id_curso ?? "",
        },
        roleInfo: {
          tipo_usuario: data?.obj?.pk_id_tipo_usuario ?? "",
        },
        userPermissions: {
          permisos: data?.obj?.permisos ?? [],
        }
      });
      router.push('/pages/main')
      
      
    } catch (e) {
      let error = e ?? "Error respuesta: (No se encontro el usuario)"
      notifyError(error)
      localStorage.setItem("userLogin", false);
      updateUserInfo({ isSignedIn: null});
      setLoadingItems(false)
      router.push('/')
    }
  }, [infoUser]
  )


  return (
    <form
      className="relative flex flex-col place-items-center"
      onSubmit={createInvoice}
    >
      <div className="form-login relative flex flex-col place-items-left my-10">
        <label htmlFor="email">Correo <b className='text-red-500'>*</b></label>
        <input
          className="bg-backg-inputs rounded-inputs mt-2 py-1 px-5"
          type="text"
          name="email"
          id="email"
          required
        />
      </div>
      <div className="form-login relative flex flex-col place-items-left mt-5 mb-10">
        <label htmlFor="password">Contraseña <b className='text-red-500'>*</b></label>
        <input
          type="password"
          name="password"
          id="password"
          className="bg-backg-inputs rounded-inputs mt-2 py-1 px-5"
          required
        />
      </div>
      <div className="relative flex place-items-center">
        <button
          type="submit"
          className="flex bg-backg-inputs-submit rounded-inputs py-1 px-5"
        >
          Iniciar Sesión
        </button>
      </div>
    </form>
  );
}
