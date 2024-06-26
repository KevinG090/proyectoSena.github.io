'use client';

import FormModelo from "@/app/components/Form";
import TipoUsuarios from "../../../utils/enum"
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, cache, ReactNode } from "react";
import { fetchPostRequest } from "../../../utils/fetch"
import { urlCreateCourses } from "../../../utils/routes"
import { notify, notifyError } from "../../../utils/notify"

export default function page() {
  const router = useRouter()
  
  const [newCourse, setNewCourse] = useState<any>({})
  const [loadingItems, setLoadingItems] = useState(false)

  const onChange = useCallback((ev: any) => {
    try {
      ev.preventDefault()
      const formData = new FormData(ev.currentTarget);
      const data = Object.fromEntries(Object.entries(Object.fromEntries(formData)))
      let copyNewCourse = { ...newCourse }
      copyNewCourse["nombre_curso"] = data?.courseName ?? ""
      // copyNewCourse["descripcion"] = data?.descripcion ?? ""
      setNewCourse(copyNewCourse)
    } catch (error) {
      notifyError("Error al modificar")
    }

  }, [])

  const createUser = useCallback(async (ev: any) => {
    ev.preventDefault()

    try {
      setLoadingItems(true)
      const url = urlCreateCourses()
      const { data }: any = await fetchPostRequest(url, newCourse)
      notify(data?.msg ?? "Creación Exitosa")
      setLoadingItems(false)

      router.push("/pages/cursos")

    } catch (e: any) {
      let error = e ?? "Error en la creación"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    [newCourse]
  )

  return (
    <FormModelo
      title={"Creación de Cursos"}
      onChange={onChange}
      onSubmit={createUser}
    >
      <div className="flex flex-row items-center my-3 justify-evenly">
        <label htmlFor="courseName" className="mx-2 w-10" >Nombre</label>
        <input
          type="text"
          id="courseName"
          name="courseName"
          value={newCourse?.nombre_curso ?? ""}
          className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Nombre completo"
        />
      </div>

      {/* <div className="flex flex-row items-center my-3 justify-evenly">
        <label htmlFor="descripcion" className="mx-2 w-40" >descripcion</label>
        <input
          type="descripcion"
          id="descripcion"
          name="descripcion"
          value={newCourse?.descripcion ?? ""}
          className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
        />
      </div> */}


      <div className="flex flex-row items-center my-3 justify-evenly">
        <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-80"
          type="submit"
        >
          Crear curso
        </button>
      </div>


    </FormModelo>
  )
}