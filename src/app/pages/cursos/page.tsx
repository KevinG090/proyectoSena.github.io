'use client';

import Cursos from "@/app/components/Cursos";
import TablaModelo from "@/app/components/TablaModelo";
import { useState, useEffect, useCallback, ReactNode} from "react";
import { fetchGetRequest } from "../../utils/fetch"
import { urlGetListCourses } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"

export default function page() {



  const [loadingItems, setLoadingItems] = useState(false)
  const [cursos, setCursos] = useState([])
  const [searchName, setSearchName] = useState<null | string>("")
  const [searchId, setSearchId] = useState<null | string>("")

  const getListCourses = useCallback(async () => {
    if (loadingItems) return
    try {
      let searchFilters: ReactNode[] | any = []
      let modifiedQueries = ""
      
      if (![null, ""].includes(searchName)) searchFilters.push(["nombre_curso", searchName])
      if (![null, ""].includes(searchId)) searchFilters.push(["pk_id_curso", searchId])
      if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };

      const url = urlGetListCourses()
      setLoadingItems(true)
      const { data }: any = await fetchGetRequest(`${url}?${modifiedQueries}`)
      notify(data?.msg ?? "Consulta Exitosa")
      setCursos(data?.obj?.results ?? [])
      setLoadingItems(false)

    } catch (e: any) {
      let error = e.message ?? "Error en la consulta"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    []
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      getListCourses()
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [getListCourses])


  return (
    <main className="main_page flex min-h-screen flex-col items-center">
      {/* <div className="relative flex flex-row bg-backg-container-blue place-items-center rounded-inputs px-6 py-1 mb-4">
        <h5 className="relative place-items-left text-xs">Cursos</h5>
      </div> */}
      {/* <div className="flex flex-col place-items-center justify-between w-52">
        {(!loadingItems) ? (
          cursos.map((val:any, index) => {
            let items = val?.nombre_curso ?? "Curso General"
            let fecha = val?.fecha ?? ""
            let contenido = val?.contenido ?? "contenido del curso"
            return <Cursos key={index} item={items} fecha={fecha} contenido={contenido} />
          })
        ) : (
          "Cargando..."
        )}

      </div > */}
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
    </main>

  );
}
