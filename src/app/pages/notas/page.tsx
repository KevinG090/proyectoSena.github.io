'use client';

import Notas from "@/app/components/Notas";
import Modal from "@/app/components/Modal";
import { useSearchParams } from 'next/navigation';

import { useState, useEffect, useCallback, useContext, ReactNode } from "react";
import { fetchGetRequest,fetchPostRequest } from "../../utils/fetch"
import { urlGetListNotas, urlCreateNotas } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"
import { infoContext } from "../../hooks/AuthHook";
import TipoUsuarios from "../../utils/enum";

export default function page() {
  const routerParams = useSearchParams();
  const pk_id_usuario = routerParams.get('pk_id_usuario');
  const pk_id_materia = routerParams.get('pk_id_materia');
  const pk_id_curso = routerParams.get('pk_id_curso');

  const { getInfo } = useContext(infoContext);
  const [InfoUser, setInfoUser] = useState<any | Object>({});

  const [materias, setMaterias] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [crearNota, setCrearNota] = useState(false)

  const [newNota, setNewNota] = useState<any | Object>({})

  useEffect(() => {
    let res: any = getInfo()
    setInfoUser(res ?? {})
  }, [getInfo])

  const getListNotas = useCallback(async () => {
    if (loadingItems || Object.keys(InfoUser).length === 0) return
    try {
      setLoadingItems(true)
      let url = urlGetListNotas()
      let searchFilters: ReactNode[] | any = []
      let modifiedQueries = ""

      if (
        [TipoUsuarios.ESTUDIANTE].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") &&
        ["", 0, null].includes(InfoUser?.userInfo?.id_usuario ?? "")
      ) return
      if ([TipoUsuarios.ESTUDIANTE].includes(InfoUser?.roleInfo?.tipo_usuario ?? "")) {
        searchFilters.push(["pk_id_usuario", InfoUser?.userInfo?.id_usuario])
      }
      else {
        if (pk_id_usuario) searchFilters.push(["pk_id_usuario", pk_id_usuario])
        if (pk_id_curso) searchFilters.push(["pk_id_curso", pk_id_curso])
      }
      if (pk_id_materia) searchFilters.push(["pk_id_materia", pk_id_materia])
      if (searchFilters.length >= 1) {
        modifiedQueries = new URLSearchParams(searchFilters).toString()
        url = `${url}?${modifiedQueries}`
      };

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
    [
      InfoUser,
      pk_id_usuario,
      pk_id_materia,
      pk_id_curso,
    ]
  )

  useEffect(() => {
    getListNotas()
  }, [getListNotas])

  const onClickButtons = useCallback((ev: any, item: any = {}, data:any = {}) => {
    try {
      ev.preventDefault()
      if ("crear" === item) {
        setCrearNota(true)
        let copyNewNota = {...newNota}
        copyNewNota["fk_relacion_usuario_curso"] = data?.fk_relacion_usuario_curso ?? ""
        copyNewNota["fk_relacion_curso_materia"] = data?.fk_relacion_curso_materia ?? ""
        setNewNota(copyNewNota)
      }
      else { setCrearNota(false) }
      setShowModal(true)
    } catch (error) {
      console.log(error)
      notifyError("Error al modificar")
    }
  }, [InfoUser])

  const createNota = useCallback(async (ev: any) => {
    ev.preventDefault()

    try {
      setLoadingItems(true)
      const url = urlCreateNotas()
      const { data }: any = await fetchPostRequest(url, newNota)
      notify(data?.msg ?? "Creación Exitosa")
      setLoadingItems(false)

    } catch (e: any) {
      let error = e ?? "Error en la creación"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    [newNota]
  )

  const editNota = useCallback(async (ev: any) => {
    ev.preventDefault()

    try {
      setLoadingItems(true)
      // const url = urlCreateCourses()
      // const { data }: any = await fetchPostRequest(url, newCourse)
      // notify(data?.msg ?? "Creación Exitosa")
      setLoadingItems(false)

    } catch (e: any) {
      let error = e ?? "Error en la creación"
      notifyError(error)
      setLoadingItems(false)
    }
  },
    []
  )
  return (
    <div className="main_page flex min-h-screen flex-col items-center">
      <div className="relative flex flex-row bg-backg-container-blue place-items-center rounded-inputs px-6 py-1 mb-4">
        <h5 className="relative place-items-left text-xs">Notas Materias</h5>
      </div>
      <div className="flex flex-col place-items-center justify-between w-52">
        {
          materias.map((val: any, index) => {
            let nombreMateria = (val?.nombre_materia ?? "Materias General").toUpperCase();
            let nombreCurso = (val?.nombre_curso ?? "").toUpperCase();
            let nombreUsuario = (val?.nombre_usuario ?? "").toUpperCase();
            let listaNotas = val?.notas ?? [];
            return <Notas
              key={index}
              data={val}
              nombreMateria={nombreMateria}
              nombreCurso={nombreCurso}
              nombreUsuario={nombreUsuario}
              notas={listaNotas}
              onClickButton={onClickButtons}
            />
          })
        }
      </div >
      <Modal
        showModal={showModal}
        closeModal={() => { setShowModal(false) }}
      >
        <form
          onSubmit={crearNota ? createNota : editNota}
          className="flex justify-center flex-col items-center my-3"
          autoComplete="off"
        >
          {crearNota ? (
            <div>
              <div className="flex flex-row items-center my-3">
                <label htmlFor="new_nota" className="mx-2 w-40" >Nota</label>
                <input
                  type="cel"
                  id="new_nota"
                  name="new_nota"
                  className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Valor de la nueva nota"
                  onChange={(ev) => {
                    let copyNewNota = {...newNota}
                    copyNewNota["nota"] = ev.target.value
                    setNewNota(copyNewNota)
                  }}
                />
              </div>
            </div>
          ) :
            <div></div>
          }
          <button
            className="flex justify-center bg-backg-container-gray rounded-inputs my-3 py-1 px-5 w-40"
          >
            {crearNota ? "crear" : "editar"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
