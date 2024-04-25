'use client';
import TablaModelo from "@/app/components/TablaModelo";

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, cache, ReactNode } from "react";
import { fetchGetRequest } from "../../utils/fetch"
import { urlGetListUsers } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"

export default function page() {
  const router = useRouter()
  const [searchName, setSearchName] = useState<null | string>("")
  const [searchId, setSearchId] = useState<null | string>("")
  const [usuarios, setUsuarios] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)

  const getListUsers = useCallback(async () => {

    if (loadingItems) return
    try {
      setLoadingItems(true)
      let searchFilters: ReactNode[] | any = []
      let modifiedQueries = ""

      if (![null, ""].includes(searchName)) searchFilters.push(["nombre_usuario", searchName])
      if (![null, ""].includes(searchId)) searchFilters.push(["pk_id_usuario", searchId])
      if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };

      const url = urlGetListUsers()
      const { data }: any = await fetchGetRequest(`${url}?${modifiedQueries}`)
      notify(data?.msg ?? "Consulta Exitosa")
      setUsuarios(data?.obj?.results ?? [])
      setLoadingItems(false)

    } catch (e: any) {
      let error = e.message ?? "Error en la consulta"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    [searchName,searchId]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      getListUsers()
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [getListUsers])

  return (
    <div className="main_page flex min-h-screen flex-col items-center">
        <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          onClick={() => router.push('/pages/users/create-users')}
        >Creacion de usuarios
        </button>

      <TablaModelo
        title={"Tabla de Usuarios"}
        description=""
        headers={[
          "Id de usuario",
          "Nombre",
          "Tipo de usuario",
        ]}
        items={usuarios.map(({
          pk_id_usuario,
          nombre_usuario,
          tipo_usuario,
        }) => ({
          pk_id_usuario,
          nombre_usuario: nombre_usuario ?? "",
          tipo_usuario: tipo_usuario ?? "",
        }))}
        footer={[]}
      >
        <div className="flex flex-row items-center my-3">
          <label htmlFor="user_id" className="mx-2" >Id usuario</label>
          <input
            type="number"
            id="user_id"
            name="user_id"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for Id"
            onChange={(ev) => { setSearchId(ev.target.value) }}
          />
        </div>
        <div className="flex flex-row items-center my-3">
          <label htmlFor="user_name" className="mx-2" >Nombre</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for name"
            onChange={(ev) => { setSearchName(ev.target.value) }}
          />
        </div>
      </TablaModelo>

    </div>
  )
}
