'use client';

import FormModelo from "@/app/components/Form";
import TipoUsuarios from "../../utils/enum"
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, cache, ReactNode } from "react";
import { fetchPostRequest, fetchGetRequest, fetchPutRequest } from "../../utils/fetch"
import { urlCreateUsers, urlGetSpecifyUsers, urlModifyUsers } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"

type Entradas = {
  id_usuario: any | string | "";
};

export default function page({ id_usuario = null }: Entradas) {
  const router = useRouter()

  const [newUser, setNewUser] = useState<any>({ "contraseña": "123456789" })
  const [loadingItems, setLoadingItems] = useState(false)
  const [listPasswords, setListPasswords] = useState<any>(["", ""])
  const [createUsers, setCreateUsers] = useState(false)

  const getInfoUser = useCallback(async () => {

    if (loadingItems) return
    try {
      setLoadingItems(true)
      let searchFilters: ReactNode[] | any = []
      let modifiedQueries = ""

      searchFilters.push(["pk_id_usuario", id_usuario])
      if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };

      const url = urlGetSpecifyUsers()
      const { data }: any = await fetchGetRequest(`${url}?${modifiedQueries}`)
      notify(data?.msg ?? "Consulta Exitosa")
      setNewUser(data?.obj?.results ?? {})
      setLoadingItems(false)

    } catch (e: any) {
      let error = e.message ?? "Error en la consulta"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    [newUser, loadingItems, id_usuario]
  )

  useEffect(() => {
    if (id_usuario) {
      setCreateUsers(false)
      getInfoUser()
    }
    // setCreateUsers(true)
  }, [id_usuario])

  const onChange = useCallback((ev: any) => {
    try {
      const formData = new FormData(ev.currentTarget);
      const data = Object.fromEntries(Object.entries(Object.fromEntries(formData)))

      let copyNewUSer = { ...newUser }
      if ("nombre_usuario" in data) {copyNewUSer["nombre_usuario"] = data?.nombre_usuario ?? ""}
      if ("celular" in data) {copyNewUSer["celular"] = data?.celular ?? ""}
      if ("identificacion" in data) {copyNewUSer["identificacion"] = data?.identificacion ?? ""}
      if ("fk_id_tipo_usuario" in data) {copyNewUSer["fk_id_tipo_usuario"] = data?.fk_id_tipo_usuario ?? ""}
      if ("correo" in data && createUsers) {copyNewUSer["correo"] = data?.correo ?? ""}

      setNewUser((prevUser:any) => ({ ...prevUser, ...copyNewUSer }));
      setListPasswords([data?.contra1 ?? listPasswords[0], data?.contra2 ?? listPasswords[1]])
    } catch (error) {
      notifyError("Error al modificar")
    }

  }, [listPasswords])

  const createUser = useCallback(async (ev: any) => {
    ev.preventDefault()

    try {
      setLoadingItems(true)
      const url = urlCreateUsers()
      const { data }: any = await fetchPostRequest(url, newUser)
      notify(data?.msg ?? "Creacion Exitosa")
      setLoadingItems(false)
      router.push("/pages/main")

    } catch (e: any) {
      let error = e ?? "Error en la creacion"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    [newUser]
  )

  const modifyUser = useCallback(async (ev: any) => {
    ev.preventDefault()

    try {
      setLoadingItems(true)
      if (["", 0, null].includes(listPasswords[0])) {
        notifyError("Contraseña incorrecta")
        return false
      }
      if (listPasswords[0] != listPasswords[1]) {
        notifyError("Contraseñas no coinciden")
        return false  
      }
      let copyNewUSer = { ...newUser }
      copyNewUSer["contraseña"] = listPasswords[0]

      const url = urlModifyUsers()
      const { data }: any = await fetchPutRequest(`${url}?pk_id_usuario=${id_usuario}`, copyNewUSer)
      notify(data?.msg ?? "Modificacion Exitosa")
      setLoadingItems(false)
      router.push("/pages/main")

    } catch (e: any) {
      let error = e ?? "Error en la modificacion"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    [newUser, id_usuario]
  )

  return (
    <FormModelo
      title={(createUsers ? "Creacion" : "Modificacion") + " de Usuarios"}
      onChange={onChange}
      onSubmit={createUsers ? createUser : modifyUser}
    >
      <div className="flex flex-row items-center my-3 justify-around">
        <label htmlFor="nombre_usuario" className="mx-2" >Nombre usaurio</label>
        <input
          type="text"
          id="nombre_usuario"
          name="nombre_usuario"
          value={newUser?.nombre_usuario ?? ""}
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Nombre completo"
        />
      </div>
      <div className="flex flex-row items-center my-3 justify-around">
        <label htmlFor="celular" className="mx-2" >Celular</label>
        <input
          type="number"
          id="celular"
          name="celular"
          value={newUser?.celular ?? ""}
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="3333333333"
        />
      </div>
      <div className="flex flex-row items-center my-3 justify-around">
        <label htmlFor="correo" className="mx-2" >Correo</label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={newUser?.correo ?? ""}
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="example@.com"
          disabled={createUsers ? false : true}
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
      {!createUsers && (
        <>
          <div className="flex flex-row items-center my-3 justify-around">
            <label htmlFor="contra1" className="mx-2" >Contraseña 1</label>
            <input
              type="number"
              id="contra1"
              name="contra1"
              value={listPasswords[0] ?? ""}
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="******"
            />
          </div>
          <div className="flex flex-row items-center my-3 justify-around">
            <label htmlFor="contra2" className="mx-2" >Contraseña 2</label>
            <input
              type="number"
              id="contra2"
              name="contra2"
              value={listPasswords[1] ?? ""}
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="******"
            />
          </div>
        </>
      )}
      <div className="flex flex-row items-center my-3 justify-around">
        <label htmlFor="fk_id_tipo_usuario" className="mx-2">Tipo de usuarios</label>
        <select
          id="fk_id_tipo_usuario"
          name="fk_id_tipo_usuario"
          className="block w-60 p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={newUser?.fk_id_tipo_usuario ?? ""}
        >
          <option selected value={TipoUsuarios.ADMINISTRADOR}>Administrador</option>
          <option value={TipoUsuarios.ESTUDIANTE}>Estudiante</option>
          <option value={TipoUsuarios.PROFESOR}>Profesor</option>
        </select>
      </div>
      <div className="flex flex-row items-center my-3 justify-between">
        <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          type="submit"
        >{(createUsers ? "Creacion" : "Modificacion") + "de Usuarios"}
        </button>
      </div>


    </FormModelo>
  )
}