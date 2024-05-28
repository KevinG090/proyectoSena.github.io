'use client';

import React, { useContext, useState, useEffect, ReactNode, useCallback } from "react";

import ConfigUsers from "@/app/components/ConfigUsers";
import { useRouter } from 'next/navigation'
import Modal from "@/app/components/Modal";
import TablaModelo from "@/app/components/TablaModelo";
import { useSearchParams } from 'next/navigation';
import { infoContext } from "../../../hooks/AuthHook";
import { fetchGetRequest, fetchPostRequest } from "../../../utils/fetch"
import { urlGetListUsers, urlCreateNotas, urlGetListMateriasCursos } from "../../../utils/routes"
import { notify, notifyError } from "../../../utils/notify"

export default function page({ params }: { params: { id: string } }) {
    const routerParams = useSearchParams();
    const router = useRouter()
    const pk_id_curso = routerParams.get('pk_id_curso');

    const { getInfo } = useContext(infoContext);
    const [InfoUser, setInfoUser] = useState<any>({});

    const [usuarios, setUsuarios] = useState([])
    const [materias, setMaterias] = useState<Record<string, any>[]>([])

    const [searchName, setSearchName] = useState<null | string>("")
    const [searchId, setSearchId] = useState<null | string>("")
    const [loadingItems, setLoadingItems] = useState(false)
    const [newNota, setNewNota] = useState<any | Object>({})

    const [selectItem, setSelectItem] = useState<null | boolean | any>(null)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<any | number>(10)
    const [nextPage, setNextPage] = useState(false)

    useEffect(() => {
        let res: any = getInfo()
        setInfoUser(res ?? {})
    }, [getInfo])

    const getListUsers = useCallback(async () => {

        if (loadingItems) return
        try {
            setLoadingItems(true)
            let searchFilters: ReactNode[] | any = []
            let modifiedQueries = ""

            searchFilters.push(["page", page])
            if (![null, ""].includes(searchName)) searchFilters.push(["nombre_usuario", searchName])
            if (![null, ""].includes(searchId)) searchFilters.push(["pk_id_usuario", searchId])
            if (![null, ""].includes(pk_id_curso)) searchFilters.push(["pk_id_curso", pk_id_curso])
            if (![null, ""].includes(limit)) searchFilters.push(["limit", limit])
            if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };

            const url = urlGetListUsers()
            const { data }: any = await fetchGetRequest(`${url}?${modifiedQueries}`)

            if ((data?.obj?.results ?? []).length < 1 ){
                notify(`No se encontraron usuarios con el comercio ${pk_id_curso}`)
                router.push("/pages/cursos")
                return
            }

            notify(data?.msg ?? "Consulta Exitosa")
            setUsuarios(data?.obj?.results ?? [])
            setNextPage(data?.obj?.next_exist ?? false)
            setLoadingItems(false)

        } catch (e: any) {
            let error = e.message ?? "Error en la consulta"
            notifyError(error)
            setLoadingItems(false)
        }
    },
        [pk_id_curso, searchName, searchId, page, limit]
    )

    useEffect(() => {
        const timeout = setTimeout(() => {
            getListUsers()
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [getListUsers])

    const getListMaterias = useCallback(async () => {
        if (loadingItems || Object.keys(InfoUser).length === 0) return
        try {
            setLoadingItems(true)
            let searchFilters: ReactNode[] | any = []
            let modifiedQueries = ""

            searchFilters.push(["page", page])
            if (![null, ""].includes(pk_id_curso)) searchFilters.push(["pk_id_curso", pk_id_curso])
            if (![null, ""].includes(limit)) searchFilters.push(["limit", limit])
            if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };

            const url = urlGetListMateriasCursos()
            const { data }: any = await fetchGetRequest(`${url}?${modifiedQueries}`)
            if ((data?.obj?.results ?? []).length < 1 ){
                notify(`No se encontraron materias con el comercio ${pk_id_curso}`)
                return
            }
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
            pk_id_curso
        ]
    )

    useEffect(() => {
        getListMaterias()
    }, [getListMaterias])

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
            setSelectItem(item)
            let copyNewNota = { ...newNota }
            copyNewNota["fk_relacion_usuario_curso"] = item?.pk_relacion_usuario_cursos
            setNewNota(copyNewNota)

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
            console.log(newNota)
            const { data }: any = await fetchPostRequest(url, newNota)
            notify(data?.msg ?? "Creacion Exitosa")
            setLoadingItems(false)

        } catch (e: any) {
            let error = e ?? "Error en la creacion"
            notifyError(error)
            setLoadingItems(false)
        }
    },
        [newNota]
    )

    if (Object.keys(InfoUser).length < 1) {
        return <>Cargando..</>
    }

    return (
        <div className="flex min-h-screen flex-col items-center">
            <TablaModelo
                title={"Tabla de Usuarios"}
                description=""
                headers={[
                    "Id de usuario",
                    "Nombre",
                ]}
                items={usuarios.map(({
                    pk_id_usuario,
                    nombre_usuario,
                    pk_relacion_usuario_cursos,
                }) => ({
                    pk_id_usuario,
                    nombre_usuario: nombre_usuario ?? "",
                    pk_relacion_usuario_cursos: pk_relacion_usuario_cursos ?? "",
                }))}
                footer={[]}
                onChangePageLimit={onChange}
                onClickRow={onChange}
                onClickItem={onClickItems}
                buttonNext={nextPage ? false : true}
                buttonPrevious={page == 1 ? true : false}
            >
                <div className="flex flex-row items-center my-3">
                    <label htmlFor="user_id" className="mx-2 w-40">Id usuario</label>
                    <input
                        type="number"
                        id="user_id"
                        name="user_id"
                        className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for Id"
                        onChange={(ev) => { setSearchId(ev.target.value) }}
                    />
                </div>
                <div className="flex flex-row items-center my-3">
                    <label htmlFor="user_name" className="mx-2 w-40" >Nombre</label>
                    <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for name"
                        onChange={(ev) => { setSearchName(ev.target.value) }}
                    />
                </div>
            </TablaModelo>
            <Modal
                showModal={selectItem}
                closeModal={() => { setSelectItem(null) }}
            >
                <form
                    onSubmit={createNota}
                    className="flex justify-center flex-col items-center my-3"
                >

                    <div className="flex flex-row items-center my-3">
                        <label htmlFor="new_nota" className="mx-2 w-40" >Nota</label>
                        <input
                            type="cel"
                            id="new_nota"
                            name="new_nota"
                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Valor de la nueva nota"
                            onChange={(ev) => {
                                let copyNewNota = { ...newNota }
                                copyNewNota["nota"] = ev.target.value
                                setNewNota(copyNewNota)
                            }}
                        />
                    </div>
                    <select
                        id="fk_relacion_curso_materia"
                        name="fk_relacion_curso_materia"
                        className="block w-60 p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={newNota?.fk_relacion_curso_materia ?? ""}
                        onChange={(ev) => {
                            let copyNewNota = { ...newNota }
                            copyNewNota["fk_relacion_curso_materia"] = ev.target.value
                            setNewNota(copyNewNota)
                        }}
                    >
                        {materias.map((value, index) => {
                            if (0 == index) return <option selected value={value?.pk_relacion_curso_materia ?? ""}>{value?.nombre_materia}</option>
                            return <option value={value?.pk_relacion_curso_materia ?? ""}>{value?.nombre_materia}</option>
                        })}
                    </select>

                    <button
                        className="flex justify-center bg-backg-container-gray rounded-inputs my-3 py-1 px-5 w-40"
                    >
                        Crear nota
                    </button>
                </form>
            </Modal>
        </div>
    )
}