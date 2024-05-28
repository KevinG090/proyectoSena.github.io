'use client';

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, ReactNode, useContext } from "react";

import TablaModelo from "@/app/components/TablaModelo";
import Modal from "@/app/components/Modal";

import TipoUsuarios from "../../utils/enum";
import { fetchGetRequest, fetchPutRequest } from "../../utils/fetch"
import { urlGetListCourses, urlEditCourses } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"
import { infoContext } from "../../hooks/AuthHook";

export default function page() {
  const router = useRouter()
  const { getInfo } = useContext(infoContext);
  const [InfoUser, setInfoUser] = useState<any | Object>({});

  const [loadingItems, setLoadingItems] = useState(false)
  const [cursos, setCursos] = useState([])
  const [searchName, setSearchName] = useState<null | string>("")
  const [searchId, setSearchId] = useState<null | string>("")
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<any | number>(10)
  const [nextPage, setNextPage] = useState(false)

  const [selectCourse, setSelectCourse] = useState<any>({});

  useEffect(() => {
    let res: any = getInfo()
    setInfoUser(res ?? {})
  }, [getInfo])

  const getListCourses = useCallback(async () => {
    if (loadingItems) return
    try {
      let searchFilters: ReactNode[] | any = []
      let modifiedQueries = ""

      searchFilters.push(["page", page])
      if (![null, ""].includes(searchName)) searchFilters.push(["nombre_curso", searchName])
      if (![null, ""].includes(searchId)) searchFilters.push(["pk_id_curso", searchId])
      if (![null, ""].includes(limit)) searchFilters.push(["limit", limit])
      if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };

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

  const editCourse = useCallback(async (ev: any) => {
    try {
      ev.preventDefault()
      const url = urlEditCourses()
      const { data }: any = await fetchPutRequest(
        `${url}?pk_id_curso=${selectCourse?.pk_id_curso}`,
        { "nombre_curso": selectCourse?.nombre_curso }
      )
      notify(data?.msg ?? "Modificacion Exitosa")
      setSelectCourse({})
      getListCourses()
    } catch (e: any) {
      let error = e ?? "Error en la modificacion"
      notifyError(error)
      setSelectCourse({})
    }
  }, [selectCourse, urlEditCourses])

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

  const onClickEdit = useCallback((ev: any, item: any = {}) => {
    try {
      ev.preventDefault()
      setSelectCourse({
        "pk_id_curso": item?.pk_id_curso ?? "",
        "nombre_curso": item?.nombre_curso ?? "",
      })
    } catch (error) {
      notifyError("Error al seleccionar curso")
    }
  }, [limit, nextPage, page])

  const onClickItems = useCallback((ev: any, item: any = {}) => {
    try {
      ev.preventDefault()

      let searchFilters: ReactNode[] | any = []
      let modifiedQueries = ""

      if (
        ![null, ""].includes(item?.pk_id_curso ?? "") &&
        [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR].includes(InfoUser?.roleInfo?.tipo_usuario ?? "")
      ) searchFilters.push(["pk_id_curso", item?.pk_id_curso ?? ""])
      if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };

      router.push(`/pages/cursos/search-students?${modifiedQueries}`)

    } catch (error) {
      console.log(error)
      notifyError("Error al modificar")
    }
  }, [InfoUser])

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
          // "Descripcion",
          "Editar",
          "Asignar Materias",
        ]}
        items={cursos.map(({
          pk_id_curso,
          nombre_curso,
          // descripcion,
          editar,
          asignar,
        }) => ({
          pk_id_curso,
          nombre_curso: nombre_curso ?? "Curso General",
          // descripcion: descripcion ?? "",
          editar: editar ?? "editar",
          asignar: asignar ?? "asignar",
        }))}
        footer={[]}
        editItem={onClickEdit}
        onChangePageLimit={onChange}
        onClickRow={onChange}
        onClickItem={onClickItems}
        buttonNext={nextPage ? false : true}
        buttonPrevious={page == 1 ? true : false}
      >
        <div className="flex flex-row items-center my-3">
          <label htmlFor="course_id" className="mx-2 w-40" >Id curso</label>
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
          <label htmlFor="course_name" className="mx-2 w-40" >Nombre</label>
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
      <Modal
        showModal={(Object.keys(selectCourse ?? {}).length >= 1)}
        closeModal={() => { setSelectCourse({}) }}
      >
        <form
          onSubmit={editCourse}
          className="flex justify-center flex-col items-center my-3"
        >

          <div className="flex flex-row items-center my-3">
            <label htmlFor="id" className="mx-2 w-40" >Nota</label>
            <input
              type="cel"
              id="id"
              name="id"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectCourse?.pk_id_curso ?? ""}
              disabled={true}
            />
          </div>
          <div className="flex flex-row items-center my-3">
            <label htmlFor="name" className="mx-2 w-40" >Nombre curso</label>
            <input
              type="text"
              id="name"
              name="name"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectCourse?.nombre_curso ?? ""}
              onChange={(ev) => {
                let copyCourse = { ...selectCourse }
                copyCourse["nombre_curso"] = ev.target.value
                setSelectCourse(copyCourse)
              }}
            />
          </div>

          <button
            className="flex justify-center bg-backg-container-gray rounded-inputs my-3 py-1 px-5 w-40"
          >
            Editar curso
          </button>
        </form>
      </Modal>
    </div>
  );
}
