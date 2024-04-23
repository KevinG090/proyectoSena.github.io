'use client';

import Cursos from "@/app/components/Cursos";
import { useState, useEffect, useCallback, cache } from "react";
import { fetchGetRequest } from "../../utils/fetch"
import { urlGetListCourses} from "../../utils/routes"
import { notify, notifyError} from "../../utils/notify"

export default function page() {
  
  

  const [loadingItems, setLoadingItems] = useState(false)
  const [cursos, setCursos] = useState([])
  // const [cursos, setCursos] = useState([
  //   { nombre_curso: "Curso 1", fecha: "2024-02-05", contenido: "contenido del curso" },
  //   { nombre_curso: "Curso 2", fecha: "2024-01-02", contenido: "contenido del curso" },
  //   { nombre_curso: "Curso S", fecha: "2023-12-01", contenido: "contenido del curso" },
  //   { nombre_curso: "Curso 4", fecha: "2023-11-05", contenido: "contenido del curso" },
  // ])


  const getListCourses = useCallback( async () => {
    if (loadingItems) return
    try {
      const url = urlGetListCourses()
      setLoadingItems(true)
      const {data} : any = await fetchGetRequest(url)
      notify(data?.msg ?? "Consulta Exitosa")
      setCursos(data?.obj?.results ?? [])
      setLoadingItems(false)
      
    }catch (e:any){
      let error = e.message ?? "Error en la consulta"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    []
  )

  useEffect(()=>{
    getListCourses()
  },[getListCourses])

  return (
    <main className="main_page flex min-h-screen flex-col items-center">
      <div className="relative flex flex-row bg-backg-container-blue place-items-center rounded-inputs px-6 py-1 mb-4">
        <h5 className="relative place-items-left text-xs">Cursos</h5>
      </div>
      <div className="flex flex-col place-items-center justify-between w-52">
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

      </div >
    </main>

  );
}
