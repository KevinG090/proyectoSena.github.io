'use client';

import Event from "@/app/components/Events";

import { useRouter } from 'next/navigation'

import { useState, useEffect, useCallback, useContext } from "react";
import { fetchGetRequest } from "../../utils/fetch"
import { urlGetListEvents } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"
import { infoContext } from "../../hooks/AuthHook";
import TipoUsuarios from "../../utils/enum";

export default function page() {
  const router = useRouter()
  const { getInfo } = useContext(infoContext);

  const [InfoUser, setInfoUser] = useState<any>({});
  const [loadingItems, setLoadingItems] = useState(false)
  const [events, setEvents] = useState([])

  const getListEvents = useCallback(async () => {
    if (loadingItems) return
    try {
      const url = urlGetListEvents()
      setLoadingItems(true)
      const { data }: any = await fetchGetRequest(url)
      notify(data?.msg ?? "Consulta Exitosa")
      setEvents(data?.obj?.results ?? [])
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
    getListEvents()
  }, [getListEvents])

  useEffect(() => {
    let res: any = getInfo()
    setInfoUser(res ?? {})
  }, [getInfo])

  return (
    <main className="main_page flex min-h-screen flex-col items-center">
      <div className="relative flex flex-row bg-backg-container-blue place-items-center rounded-inputs px-6 py-1 mb-4">
        <h5 className="relative place-items-left text-xs">Eventos</h5>
      </div>
      {[TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") && (
        <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          onClick={() => router.push('/pages/main/create-events')}
        >Crear Eventos
        </button>
      )}
      <div className="flex flex-col place-items-center justify-between w-full">
        {
          events.map((val: any, index) => {
            let items = val?.nombre_evento ?? "Evento General"
            let fecha = val?.fecha_publicacion ?? ""
            let contenido = val?.contenido ?? "contenido"
            return <Event key={index} item={items} fecha={fecha} contenido={contenido} />
          })
        }
      </div >
    </main>
  );
}