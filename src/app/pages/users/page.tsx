'use client';

import TablaModelo from "@/app/components/TablaModelo";

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, useContext, ReactNode } from "react";
import { fetchGetRequest } from "../../utils/fetch"
import { urlGetListUsers } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"
import { infoContext } from "../../hooks/AuthHook";

import TipoUsuarios from "../../utils/enum";
import Modal from "@/app/components/Modal";
import ConfigUsers from "@/app/components/ConfigUsers";

export default function page() {
  const router = useRouter()
  const { getInfo } = useContext(infoContext);
  const [InfoUser, setInfoUser] = useState<any | Object>({});

  const [searchName, setSearchName] = useState<null | string>("")
  const [searchId, setSearchId] = useState<null | string>("")
  const [usuarios, setUsuarios] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [selectUser, setSelectUser] = useState<null | boolean | any>({})

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<any | number>(10)
  const [nextPage, setNextPage] = useState(false)

  useEffect(() => {
    let res: any = getInfo()
    setInfoUser(res ?? {})
  }, [getInfo])

  const getListUsers = useCallback(async () => {

    if (loadingItems) return
    try {
      setLoadingItems(true)
      let searchFilters: ReactNode[] | any = []
      let modifiedQueries = ""

      searchFilters.push(["page", page])
      if (![null, ""].includes(searchName)) searchFilters.push(["nombre_usuario", searchName])
      if (![null, ""].includes(searchId)) searchFilters.push(["pk_id_usuario", searchId])
      if (![null, ""].includes(limit)) searchFilters.push(["limit", limit])
      if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };

      const url = urlGetListUsers()
      const { data }: any = await fetchGetRequest(`${url}?${modifiedQueries}`)
      notify(data?.msg ?? "Consulta Exitosa")
      setUsuarios(data?.obj?.results ?? [])
      setNextPage(data?.obj?.next_exist ?? false)
      setLoadingItems(false)

    } catch (e: any) {
      let error = e.message ?? "Error en la consulta"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    [searchName, searchId, page, limit]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      getListUsers()
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [getListUsers])

  const onChange = useCallback((ev: any, item: string = "") => {
    try {
      ev.preventDefault()
      const formData = new FormData(ev.currentTarget.form);
      const data = Object.fromEntries(Object.entries(Object.fromEntries(formData)))

      if ("limit" == item && data?.limit != limit) setLimit(data?.limit)
      if ("next" == item && nextPage) setPage((old) => old + 1)
      if ("prev" == item && page != 1) setPage((old) => old - 1)

    } catch (error) {
      console.log(error)
      notifyError("Error al modificar")
    }
  }, [limit, nextPage, page])

  const asignarCursos = useCallback((ev: any, item: any = {}) => {
    try {
      ev.preventDefault()
      router.push(`/pages/users/asignar-cursos?pk_id_usuario=${item.pk_id_usuario}`)
    } catch (error) {
      notifyError("Error al seleccionar curso")
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center">
      {[TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") && (
        <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          onClick={() => router.push('/pages/users/create-users')}
        >Creación de usuarios
        </button>

      )}

      <TablaModelo
        title={"Tabla de Usuarios"}
        description=""
        headers={[
          "Id de usuario",
          "Nombre",
          "Tipo de usuario",
          "Editar",
          "Asignar Curso",
        ]}
        items={usuarios.map(({
          pk_id_usuario,
          nombre_usuario,
          tipo_usuario,
          editar,
          asignar,
        }) => ({
          pk_id_usuario,
          nombre_usuario: nombre_usuario ?? "",
          tipo_usuario: tipo_usuario ?? "",
          editar: editar ?? "editar",
          asignar: "estudiante" == tipo_usuario && "asignar",
        }))}
        footer={[]}
        onChangePageLimit={onChange}
        asignarItem = {asignarCursos}
        editItem = {(ev,data) => {
          ev.preventDefault()
          setSelectUser(data)
        }}
        onClickRow={onChange}
        buttonNext={nextPage ? false : true}
        buttonPrevious={page == 1 ? true : false}
      >
        <div className="flex flex-row items-center my-3">
          <label htmlFor="user_id" className="mx-2 w-40">Id usuario</label>
          <input
            type="number"
            id="user_id"
            name="user_id"
            className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for Id"
            onChange={(ev) => { setSearchId(ev.target.value) }}
          />
        </div>
        <div className="flex flex-row items-center my-3">
          <label htmlFor="user_name" className="mx-2 w-40" >Nombre</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for name"
            onChange={(ev) => { setSearchName(ev.target.value) }}
          />
        </div>
      </TablaModelo>
      <Modal
        showModal={(Object.keys(selectUser ?? {}).length >= 1)}
        closeModal={() => { setSelectUser({}) }}
      >
          <ConfigUsers id_usuario={selectUser?.pk_id_usuario ?? null} only_pass={true}></ConfigUsers>
      </Modal>
    </div>
  )
}
