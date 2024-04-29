'use client';

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, ReactNode } from "react";

import Cursos from "@/app/components/Cursos";
import TablaModelo from "@/app/components/TablaModelo";

import { fetchGetRequest } from "../../utils/fetch"
import { urlGetListCourses } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"

export default function page() {
  const router = useRouter()

  const [loadingItems, setLoadingItems] = useState(false)
  const [cursos, setCursos] = useState([])
  const [searchName, setSearchName] = useState<null | string>("")
  const [searchId, setSearchId] = useState<null | string>("")
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<any | number>(10)
  const [nextPage, setNextPage] = useState(false)

  const getListCourses = useCallback(async () => {
    if (loadingItems) return
    try {
      let searchFilters: ReactNode[] | any = []
      let modifiedQueries = ""

      if (![null, ""].includes(searchName)) searchFilters.push(["nombre_curso", searchName])
      if (![null, ""].includes(searchId)) searchFilters.push(["pk_id_curso", searchId])
      if (![null, ""].includes(limit)) searchFilters.push(["limit", limit])
      if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };
      searchFilters.push(["page", page])

      const url = urlGetListCourses()
      setLoadingItems(true)
      const { data }: any = await fetchGetRequest(`${url}?${modifiedQueries}`)
      notify(data?.msg ?? "Consulta Exitosa")
      setCursos(data?.obj?.results ?? [])
      setNextPage(data?.obj?.next_exist ?? false)
      setLoadingItems(false)

    } catch (e: any) {
      let error = e.message ?? "Error en la consulta"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    [searchName, searchId, limit, page]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      getListCourses()
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [getListCourses])

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
  }, [])

  return (
    <div className="main_page flex min-h-screen flex-col items-center">
      <button
        className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
        onClick={() => router.push('/pages/cursos/create-cursos')}
      >Creacion de cursos
      </button>
      <TablaModelo
        title={"Tabla de Cursos"}
        description=""
        headers={[
          "Id del curso",
          "Nombre",
          "Descripcion",
        ]}
        items={cursos.map(({
          pk_id_curso,
          nombre_curso,
          descripcion,
        }) => ({
          pk_id_curso,
          nombre_curso: nombre_curso ?? "Curso General",
          descripcion: descripcion ?? "",
        }))}
        footer={[]}
        onChangePageLimit={onChange}
        onClickRow={onChange}
        buttonNext={nextPage ? true : false}
        buttonPrevious={page != 1 ? true : false}
      >
        <div className="flex flex-row items-center my-3">
          <label htmlFor="course_id" className="mx-2" >Id Curso</label>
          <input
            type="number"
            id="course_id"
            name="course_id"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for Id"
            onChange={(ev) => { setSearchId(ev.target.value) }}
          />
        </div>
        <div className="flex flex-row items-center my-3">
          <label htmlFor="course_name" className="mx-2" >Nombre</label>
          <input
            type="text"
            id="course_name"
            name="course_name"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for name"
            onChange={(ev) => { setSearchName(ev.target.value) }}
          />
        </div>
      </TablaModelo>
    </div>

  );
}
