'use client';

import FormModelo from "@/app/components/Form";
import TipoUsuarios from "../../../utils/enum"
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, cache, ReactNode } from "react";
import { fetchPostRequest } from "../../../utils/fetch"
import { urlCreateUsers } from "../../../utils/routes"
import { notify, notifyError } from "../../../utils/notify"

export default function page() {
  const [newUser, setNewUser] = useState<any>({ "contraseña": "123456789" })
  const [loadingItems, setLoadingItems] = useState(false)

  const onChange = useCallback((ev: any) => {
    try {
      const formData = new FormData(ev.currentTarget);
      const data = Object.fromEntries(Object.entries(Object.fromEntries(formData)))
      let copyNewUSer = { ...newUser }
      copyNewUSer["nombre_usuario"] = data?.userName ?? ""
      copyNewUSer["celular"] = data?.userCel ?? ""
      copyNewUSer["correo"] = data?.email ?? ""
      copyNewUSer["identificacion"] = data?.identificacion ?? ""
      copyNewUSer["fk_id_tipo_usuario"] = data?.tipoUsuario ?? ""
      setNewUser(copyNewUSer)
    } catch (error) {
      notifyError("Error al modificar")
    }

  }, [])

  const createUser = useCallback(async (ev: any) => {
    ev.preventDefault()

    try {
      setLoadingItems(true)
      const url = urlCreateUsers()
      const { data }: any = await fetchPostRequest(url, newUser)
      notify(data?.msg ?? "Creacion Exitosa")
      setLoadingItems(false)

    } catch (e: any) {
      let error = e.message ?? "Error en la creacion"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    [newUser]
  )

  return (
    <FormModelo
      title={"Creacion de Usuarios"}
      onChange={onChange}
      onSubmit={createUser}
    >
      <div className="flex flex-row items-center my-3 justify-around">
        <label htmlFor="userName" className="mx-2" >Nombre usaurio</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={newUser?.nombre_usuario ?? ""}
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Nombre completo"
        />
      </div>
      <div className="flex flex-row items-center my-3 justify-around">
        <label htmlFor="userCel" className="mx-2" >Celular</label>
        <input
          type="number"
          id="userCel"
          name="userCel"
          value={newUser?.celular ?? ""}
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="3333333333"
        />
      </div>
      <div className="flex flex-row items-center my-3 justify-around">
        <label htmlFor="email" className="mx-2" >Correo</label>
        <input
          type="email"
          id="email"
          name="email"
          value={newUser?.correo ?? ""}
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="example@.com"
        />
      </div>
      <div className="flex flex-row items-center my-3 justify-around">
        <label htmlFor="identificacion" className="mx-2" >Identificacion</label>
        <input
          type="number"
          id="identificacion"
          name="identificacion"
          value={newUser?.identificacion ?? ""}
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="4444444444"
        />
      </div>
      <div className="flex flex-row items-center my-3 justify-around">
      <label htmlFor="tipoUsuario" className="mx-2">Tipo de usuarios</label>
        <select id="tipoUsuario" name="tipoUsuario" className="block w-60 p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected value={TipoUsuarios.ADMINISTRADOR}>Administrador</option>
          <option value={TipoUsuarios.ESTUDIANTE}>Estudiante</option>
          <option value={TipoUsuarios.PROFESOR}>Profesor</option>
        </select>
      </div>
      <div className="flex flex-row items-center my-3 justify-between">
        <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          type="submit"
        >Crear usuario
        </button>
      </div>


    </FormModelo>
  )
}