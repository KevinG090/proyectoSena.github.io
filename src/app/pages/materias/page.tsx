'use client';

import TablaModelo from "@/app/components/TablaModelo";
import Modal from "@/app/components/Modal";

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, useContext, ReactNode } from "react";
import { fetchGetRequest, fetchPutRequest } from "../../utils/fetch"
import { urlGetListMateriasCursos, urlEditMaterias } from "../../utils/routes"
import { notify, notifyError } from "../../utils/notify"
import { infoContext } from "../../hooks/AuthHook";
import TipoUsuarios from "../../utils/enum";

const tableHeaders = [
    "Id materia",
    "Nombre materia",
    "Id curso",
    "Nombre curso",
    "Editar",
]

export default function page() {
    const router = useRouter()
    const { getInfo } = useContext(infoContext);
    const [InfoUser, setInfoUser] = useState<any>({});

    const [materias, setMaterias] = useState([])
    const [loadingItems, setLoadingItems] = useState(false)

    const [searchNameCourse, setSearchNameCourse] = useState<null | string>("")
    const [searchIdCourse, setSearchIdCourse] = useState<null | any | string>("")
    const [searchNameMaterias, setSearchNameMaterias] = useState<null | string>("")
    const [searchIdMaterias, setSearchIdMaterias] = useState<null | string>("")

    const [selectMateria, setSelectMateria] = useState<any>({});

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<any | number>(10)
    const [nextPage, setNextPage] = useState(false)

    useEffect(() => {
        let res: any = getInfo()
        setInfoUser(res ?? {})
    }, [getInfo])

    useEffect(() => {
        if (Object.keys(InfoUser).length === 0) return

        if ([TipoUsuarios.ESTUDIANTE].includes(InfoUser?.roleInfo?.tipo_usuario ?? "")) {
            setSearchIdCourse(InfoUser?.userInfo?.pk_id_curso ?? "")
        }
    }, [InfoUser])

    const getListMaterias = useCallback(async () => {
        if (loadingItems || Object.keys(InfoUser).length === 0) return
        try {
            setLoadingItems(true)
            let searchFilters: ReactNode[] | any = []
            let modifiedQueries = ""

            searchFilters.push(["page", page])
            if (
                [null, ""].includes(searchIdCourse) &&
                [TipoUsuarios.ESTUDIANTE].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") &&
                ![null, ""].includes(InfoUser?.userInfo?.pk_id_curso ?? "")
            ) searchFilters.push(["pk_id_curso", InfoUser?.userInfo?.pk_id_curso])
            else if (![null, ""].includes(searchIdCourse)) searchFilters.push(["pk_id_curso", searchIdCourse])

            if (![null, ""].includes(searchNameCourse)) searchFilters.push(["nombre_curso", searchNameCourse])
            if (![null, ""].includes(searchNameMaterias)) searchFilters.push(["nombre_materia", searchNameMaterias])
            if (![null, ""].includes(searchIdMaterias)) searchFilters.push(["pk_id_materia", searchIdMaterias])

            if (![null, ""].includes(limit)) searchFilters.push(["limit", limit])
            if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };

            const url = urlGetListMateriasCursos()
            const { data }: any = await fetchGetRequest(`${url}?${modifiedQueries}`)
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
            searchNameCourse,
            searchIdCourse,
            searchNameMaterias,
            searchIdMaterias,
        ]
    )

    useEffect(() => {
        getListMaterias()
    }, [getListMaterias])

    const editMateria = useCallback(async (ev: any) => {
        try {
            ev.preventDefault()
            const url = urlEditMaterias()
            const { data }: any = await fetchPutRequest(
                `${url}?pk_id_materia=${selectMateria?.pk_id_materia}`,
                { "nombre_materia": selectMateria?.nombre_materia }
            )
            notify(data?.msg ?? "Modificación Exitosa")
            setSelectMateria({})
            getListMaterias()
        } catch (e: any) {
            let error = e ?? "Error en la modificacion"
            notifyError(error)
            setSelectMateria({})
        }
    }, [selectMateria, urlEditMaterias])


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

    const onClickItems = useCallback((ev: any, item: any = {}) => {
        try {
            ev.preventDefault()
            let searchFilters: ReactNode[] | any = []
            let modifiedQueries = ""

            if (
                ![null, ""].includes(item?.pk_id_curso ?? "") &&
                [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR].includes(InfoUser?.roleInfo?.tipo_usuario ?? "")
            ) searchFilters.push(["pk_id_curso", item?.pk_id_curso ?? ""])
            if (![null, ""].includes(item?.pk_id_materia ?? "")) searchFilters.push(["pk_id_materia", item?.pk_id_materia ?? ""])
            if (searchFilters.length >= 1) {
                modifiedQueries = new URLSearchParams(searchFilters).toString()
                router.push(`/pages/notas?${modifiedQueries}`)
            }
            else router.push(`/pages/notas`)


        } catch (error) {
            console.log(error)
            notifyError("Error al modificar")
        }
    }, [InfoUser])

    const onClickEdit = useCallback((ev: any, item: any = {}) => {
        try {
            ev.preventDefault()
            setSelectMateria({
                "pk_id_materia": item?.pk_id_materia ?? "",
                "nombre_materia": item?.nombre_materia ?? "",
            })
        } catch (error) {
            notifyError("Error al seleccionar la materia")
        }
    }, [])

    if (
        [TipoUsuarios.ESTUDIANTE].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") &&
        ["", "none", null].includes(InfoUser?.userInfo?.pk_id_curso ?? "")
    ) {
        return <div className="main_page flex min-h-screen flex-col items-center">
            <h2>Contactarse con su docente o soporte para asignarle un curso</h2>
        </div>
    }


    return (
        <div className="main_page flex min-h-screen flex-col items-center">
            {[TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") && (
                <button
                    className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
                    onClick={() => router.push('/pages/materias/create-materias')}
                >Creación de materias
                </button>

            )}

            <TablaModelo
                title={"Tabla de materias"}
                description=""
                headers={[TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") ? (
                    tableHeaders
                ) : tableHeaders.filter((item) => item != "Editar")}
                items={materias.map(({
                    pk_id_materia,
                    nombre_materia,
                    pk_id_curso,
                    nombre_curso,
                    editar,
                }) => ({
                    pk_id_materia,
                    nombre_materia: nombre_materia ?? "",
                    pk_id_curso: pk_id_curso ?? "",
                    nombre_curso: nombre_curso ?? "",
                    editar: editar ?? "editar",
                }))}
                footer={[]}
                onChangePageLimit={onChange}
                onClickRow={onChange}
                editItem={onClickEdit}
                onClickItem={onClickItems}
                buttonNext={nextPage ? false : true}
                buttonPrevious={page == 1 ? true : false}
            >
                <div className="flex flex-row items-center my-3">
                    <label htmlFor="pk_id_materia" className="mx-2 w-40" >Id materia</label>
                    <input
                        type="number"
                        id="pk_id_materia"
                        name="pk_id_materia"
                        className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for Id"
                        onChange={(ev) => { setSearchIdMaterias(ev.target.value) }}
                        autoComplete="none"
                    />
                </div>
                <div className="flex flex-row items-center my-3">
                    <label htmlFor="nombre_materia" className="mx-2 w-40" >Nombre materia</label>
                    <input
                        type="text"
                        id="nombre_materia"
                        name="nombre_materia"
                        className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for name"
                        onChange={(ev) => { setSearchNameMaterias(ev.target.value) }}
                        autoComplete="none"
                    />
                </div>
                <div className="flex flex-row items-center my-3">
                    <label htmlFor="pk_id_curso" className="mx-2 w-40" >Id curso</label>
                    <input
                        type="number"
                        id="pk_id_curso"
                        name="pk_id_curso"
                        className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for Id"
                        value={searchIdCourse}
                        onChange={(ev) => { setSearchIdCourse(ev.target.value) }}
                        disabled={[TipoUsuarios.ESTUDIANTE].includes(InfoUser?.roleInfo?.tipo_usuario) ? true : false}
                    />
                </div>
                <div className="flex flex-row items-center my-3">
                    <label htmlFor="nombre_curso" className="mx-2 w-40" >Nombre curso</label>
                    <input
                        type="text"
                        id="nombre_curso"
                        name="nombre_curso"
                        className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for name"
                        onChange={(ev) => { setSearchNameCourse(ev.target.value) }}
                    />
                </div>
            </TablaModelo>
            <Modal
                showModal={(Object.keys(selectMateria ?? {}).length >= 1)}
                closeModal={() => { setSelectMateria({}) }}
            >
                <form
                    onSubmit={editMateria}
                    className="flex justify-center flex-col items-center my-3"
                >

                    <div className="flex flex-row items-center my-3">
                        <label htmlFor="id" className="mx-2 w-40" >Id materia</label>
                        <input
                            type="cel"
                            id="id"
                            name="id"
                            className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={selectMateria?.pk_id_materia ?? ""}
                            disabled={true}
                        />

                    </div>
                    <div className="flex flex-row items-center my-3">
                        <label htmlFor="name" className="mx-2 w-40" >Nombre materia</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={selectMateria?.nombre_materia ?? ""}
                            onChange={(ev) => {
                                let copyCourse = { ...selectMateria }
                                copyCourse["nombre_materia"] = ev.target.value
                                setSelectMateria(copyCourse)
                            }}
                        />
                    </div>

                    <button
                        className="flex justify-center bg-backg-container-gray rounded-inputs my-3 py-1 px-5 w-40"
                    >
                        Editar materia
                    </button>
                </form>
            </Modal>
        </div>
    );
}
