'use client';

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, useContext } from "react";
import { fetchGetRequest } from "./utils/fetch"
import { urlLogin } from "./utils/routes"
import { notify, notifyError } from "./utils/notify"
import { infoContext } from "./hooks/AuthHook"

export default function FormLogin() {
  const router = useRouter()
  const { userInfo, updateUserInfo } = useContext(infoContext);

  const [loadingItems, setLoadingItems] = useState(false)
  const [infoUser, setInfoUser] = useState(null)

  const createInvoice = useCallback(async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);
    const formDataEntries = formData.entries();

    // Convertir FormDataEntries a un array de objetos
    const formDataArray = Array.from(formDataEntries);

    // Modificar los datos según sea necesario
    const modifiedFormData = formDataArray.map(([key, value]) => {
      return [key, value];
    });
    // Convertir el array modificado a URLSearchParams
    const modifiedQueries = new URLSearchParams(modifiedFormData).toString();


    try {
      const url = urlLogin()
      setLoadingItems(true)
      const { data } = await fetchGetRequest(`${url}?${modifiedQueries}`)
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
        <label htmlFor="email">Correo <b>*</b></label>
        <input
          className="bg-backg-inputs rounded-inputs mt-2 py-1 px-5"
          type="text"
          name="email"
          id="email"
          required
        />
      </div>
      <div className="form-login relative flex flex-col place-items-left mt-5 mb-10">
        <label htmlFor="passworld">Contraseña <b>*</b></label>
        <input
          type="text"
          name="passworld"
          id="passworld"
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
