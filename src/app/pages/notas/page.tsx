'use client';

import Navbar from "@/app/components/Navbar";
import Notas from "@/app/components/Notas";
import { useState, useEffect, useCallback, cache } from "react";
import { fetchGetRequest } from "../../utils/fetch"
import { urlGetListMaterias } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"

export default function page() {

  const [materias, setMaterias] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  // const [materias, setMaterias] = useState([
  //   {item:"materias 1", fecha : "2024-02-05", notas : [{val:1},{val:5},{val:4}]},
  //   {item:"materias 2", fecha : "2024-01-02", notas : [{val:3},{val:4}]},
  //   {item:"materias S", fecha : "2023-12-01", notas : [{val:0}]},
  //   {item:"materias 4", fecha : "2023-11-05", notas : [{val:5}]},
  // ])


  const getListCourses = useCallback(async () => {
    if (loadingItems) return
    try {
      const url = urlGetListMaterias()
      setLoadingItems(true)
      const { data }: any = await fetchGetRequest(url)
      notify(data?.msg ?? "Consulta Exitosa")
      setMaterias(data?.obj?.results ?? [])
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
    getListCourses()
  }, [getListCourses])

  return (
    <main className="main_page flex min-h-screen flex-col items-center">
      <Navbar />
      <div className="relative flex flex-row bg-backg-container-blue place-items-center rounded-inputs px-6 py-1 mb-4">
        <h5 className="relative place-items-left text-xs">Notas Materias</h5>
      </div>
      <div className="flex flex-col place-items-center justify-between w-52">
        {
          materias.map((val: any, index) => {
            let items = val?.nombre_materia ?? "Materias General"
            let fecha = val?.fecha ?? ""
            let listaNotas = val?.notas ?? [{ val: 0 }]
            return <Notas key={index} item={items} fecha={fecha} notas={listaNotas} />
          })
        }
      </div >
    </main>
  );
}
