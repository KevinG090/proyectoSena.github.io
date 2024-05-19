'use client';

import FormModelo from "@/app/components/Form";
import TipoUsuarios from "../../../utils/enum"
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, cache, ReactNode } from "react";
import { fetchPostRequest } from "../../../utils/fetch"
import { urlCreateEvents } from "../../../utils/routes"
import { notify, notifyError } from "../../../utils/notify"

export default function page() {
  const router = useRouter()

  const [newEvent, setNewEvent] = useState<any>({})
  const [loadingItems, setLoadingItems] = useState(false)

  const onChange = useCallback((ev: any) => {
    try {
      const formData = new FormData(ev.currentTarget);
      const data = Object.fromEntries(Object.entries(Object.fromEntries(formData)))
      let copyNewEvent = { ...newEvent }
      copyNewEvent["nombre_evento"] = data?.EventName ?? ""
      copyNewEvent["contenido"] = data?.contenido ?? ""
      setNewEvent(copyNewEvent)
    } catch (error) {
      notifyError("Error al modificar")
    }

  }, [])

  const createUser = useCallback(async (ev: any) => {
    ev.preventDefault()

    try {
      setLoadingItems(true)
      const url = urlCreateEvents()
      const { data }: any = await fetchPostRequest(url, newEvent)
      notify(data?.msg ?? "Creacion Exitosa")
      setLoadingItems(false)

    } catch (e: any) {
      let error = e ?? "Error en la creacion"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    [newEvent]
  )

  return (
    <FormModelo
      title={"Creacion de Eventos"}
      onChange={onChange}
      onSubmit={createUser}
    >
      <div className="flex flex-row items-center my-3 justify-around">
        <label htmlFor="EventName" className="mx-2" >Nombre</label>
        <input
          type="text"
          id="EventName"
          name="EventName"
          value={newEvent?.nombre_evento ?? ""}
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Nombre completo"
        />
      </div>

      <div className="flex flex-row items-center my-3 justify-around">
        <label htmlFor="contenido" className="mx-2" >contenido</label>
        <input
          type="contenido"
          id="contenido"
          name="contenido"
          value={newEvent?.contenido ?? ""}
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
        />
      </div>


      <div className="flex flex-row items-center my-3 justify-between">
        <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          type="submit"
        >
          Crear evento
        </button>
      </div>


    </FormModelo>
  )
}