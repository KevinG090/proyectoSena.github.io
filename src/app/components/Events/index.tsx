'use client';

import { useState, useEffect, useCallback, useContext } from "react";

import Modal from "@/app/components/Modal";

import { urlModifyEvents, urlDeleteEvents } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"
import { fetchDeleteRequest, fetchPutRequest } from "../../utils/fetch"
import TipoUsuarios from "../../utils/enum";
import { infoContext } from "../../hooks/AuthHook";

export default function Event({ data = {}, getListEvents = async () => { } }) {

  const [InfoUser, setInfoUser] = useState<any>({});
  const { getInfo } = useContext(infoContext);

  const [event, setEvent] = useState<any>({});
  const [selectEvent, setSelectEvent] = useState<any>({});
  const [deleteEvent, setDeleteEvent] = useState<any>({});

  useEffect(() => { setEvent(data) }, [data])

  useEffect(() => {
    let res: any = getInfo()
    setInfoUser(res ?? {})
  }, [getInfo])

  const eliminarEvento = useCallback(async (ev: any) => {
    try {
      ev.preventDefault()
      let url = urlDeleteEvents()

      const { data }: any = await fetchDeleteRequest(
        `${url}?pk_id_evento=${deleteEvent?.pk_id_evento}`
      )
      notify(data?.msg ?? "Eliminación Exitosa")
      setDeleteEvent({})
      setTimeout(async () => {
        await getListEvents()
      }, 1000)
    } catch (error) {
      console.log(error)
      notifyError("Error al modificar")
    }
  }, [InfoUser, deleteEvent])

  const editEvent = useCallback(async (ev: any) => {
    try {
      ev.preventDefault()
      const formData = new FormData(ev.currentTarget);
      const info = Object.fromEntries(Object.entries(Object.fromEntries(formData)))

      let body: any = {}
      if ("nombre_evento" in info) { body["nombre_evento"] = info?.nombre_evento ?? "" }
      if ("contenido" in info) { body["contenido"] = info?.contenido ?? "" }

      const url = urlModifyEvents()
      const { data }: any = await fetchPutRequest(
        `${url}?pk_id_evento=${selectEvent?.pk_id_evento}`, body
      )
      notify(data?.msg ?? "Modificación Exitosa")
      setSelectEvent({})
      setTimeout(async () => {
        await getListEvents()
      }, 1000)
    } catch (e: any) {
      let error = e ?? "Error en la modificacion"
      notifyError(error)
      setSelectEvent({})
    }
  }, [selectEvent, urlModifyEvents])

  return (
    <div className="relative flex flex-col bg-backg-container-blue rounded-inputs p-3 mt-3 w-48 min-[320px]:w-18 md:w-96">
      {/* className="relative flex flex-col bg-backg-container-blue rounded-inputs p-3 md:w-96 lg:w-full mt-3 */}

      <div className="relative flex flex-row place-items-center justify-between">
        <h5 className="relative place-items-left text-xs">{event?.nombre_evento ?? "Evento General"}</h5>
        <h5 className="relative place-items-rigth text-dates">{event?.fecha_publicacion ?? ""}</h5>
      </div>

      <div className="flex flex-col bg-background-main-page p-2 place-items-center justify-center rounded mt-2 h-auto ">
        <div className="flex flex-col relative place-items-center">
          <h5 className="flex text-center md:text-center text-xs">{event?.contenido ?? "contenido"}</h5>
        </div>
      </div>
      {[TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") && (

        <div className="flex justify-around rounded-inputs py-1 px-1 ">
          <button
            className="flex justify-center bg-backg-container-gray rounded-inputs text-sm my-3 py-1 px-5 w-40"
            onClick={(ev) => {
              ev.preventDefault()
              console.log(data)
              setSelectEvent(data)
            }}
          >Editar
          </button>
          <button
            className="flex justify-center bg-backg-container-gray rounded-inputs text-sm my-3 py-1 px-5 w-40"
            onClick={(ev) => {
              ev.preventDefault()
              setDeleteEvent(data)
            }}
          >
            Eliminar
          </button>
        </div>
      )}
      <Modal
        showModal={(Object.keys(selectEvent ?? {}).length >= 1)}
        closeModal={() => { setSelectEvent({}) }}
      >
        <form
          onSubmit={editEvent}
          className="flex justify-center flex-col items-center my-3"
        >

          <div className="flex flex-row items-center my-3">
            <label htmlFor="id" className="mx-2 w-40" >Id evento</label>
            <input
              type="cel"
              id="id"
              name="id"
              className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectEvent?.pk_id_evento ?? ""}
              disabled={true}
            />
          </div>
          <div className="flex flex-row items-center my-3">
            <label htmlFor="nombre_evento" className="mx-2 w-40" >Nombre evento</label>
            <input
              type="text"
              id="nombre_evento"
              name="nombre_evento"
              className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectEvent?.nombre_evento ?? ""}
              onChange={(ev) => {
                let copyCourse = { ...selectEvent }
                copyCourse["nombre_evento"] = ev.target.value
                setSelectEvent(copyCourse)
              }}
            />
          </div>
          <div className="flex flex-row items-center my-3">
            <label htmlFor="contenido" className="mx-2 w-40" >Contenido</label>
            <textarea
              id="contenido"
              name="contenido"
              className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectEvent?.contenido ?? ""}
              onChange={(ev) => {
                let copyCourse = { ...selectEvent }
                copyCourse["contenido"] = ev.target.value
                setSelectEvent(copyCourse)
              }}
            />
          </div>

          <button
            className="flex justify-center bg-backg-container-gray rounded-inputs my-3 py-1 px-5 w-40"
          >
            Editar evento
          </button>
        </form>
      </Modal>
      <Modal
        showModal={(Object.keys(deleteEvent ?? {}).length >= 1)}
        closeModal={() => setDeleteEvent([])}
      >
        <div>
          <h2>¿Esta seguro de eliminar el evento?</h2>
          <p>Nombre del evento: {deleteEvent?.nombre_evento}</p>
          <p>Contenido: {deleteEvent?.contenido}</p>
        </div>
        <button
          className="flex justify-center bg-backg-container-gray rounded-inputs my-3 py-1 px-5 w-40"
          onClick={(ev) => eliminarEvento(ev)}
        >Eliminar
        </button>
      </Modal>
    </div>
  )
}
