'use client';

import TablaModelo from "@/app/components/TablaModelo";
import Modal from "@/app/components/Modal";

import { useRouter, useSearchParams } from 'next/navigation'

import { useState, useEffect, useCallback, useContext, ReactNode } from "react";
import { fetchGetRequest, fetchPostRequest } from "../../../utils/fetch"
import { urlGetSpecifyUsers, urlGetListCourses, urlAsignarCursos } from "../../../utils/routes"
import { notify, notifyError } from "../../../utils/notify"
import { infoContext } from "../../../hooks/AuthHook";

export default function page({ params }: { params: { id: string } }) {
    const router = useRouter()
    const routerParams = useSearchParams();
    const pk_id_usuario = routerParams.get('pk_id_usuario');


    useEffect(() => {
        if (!pk_id_usuario) router.push("/pages/users")
    }, [pk_id_usuario])


    const { getInfo } = useContext(infoContext);
    const [InfoUser, setInfoUser] = useState<any>({});

    const [usuario, setUsuario] = useState<Record<string, any>[]>([{}])
    const [listCrusos, setListCrusos] = useState([])
    const [loadingItems, setLoadingItems] = useState(false)

    const [selectMateria, setSelectMateria] = useState<any>([]);

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<any | number>(20)
    const [nextPage, setNextPage] = useState(false)

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        let res: any = getInfo()
        setInfoUser(res ?? {})
    }, [getInfo])

    const getListUsuarios = useCallback(async () => {
        if (loadingItems || Object.keys(InfoUser).length === 0) return
        try {
            setLoadingItems(true)
            let searchFilters: ReactNode[] | any = []
            let modifiedQueries = ""

            searchFilters.push(["page", page])
            if (![null, ""].includes(pk_id_usuario)) searchFilters.push(["pk_id_usuario", pk_id_usuario])
            if (![null, ""].includes(limit)) searchFilters.push(["limit", limit])
            if (searchFilters.length >= 1) { modifiedQueries = new URLSearchParams(searchFilters).toString() };

            const url = urlGetSpecifyUsers()
            const { data }: any = await fetchGetRequest(`${url}?${modifiedQueries}`)
            // notify(data?.msg ?? "Consulta Exitosa")
            setUsuario([data?.obj?.results ?? {}])
            setLoadingItems(false)

        } catch (e: any) {
            let error = e.message ?? "Error en la consulta"
            notifyError(error)
            setLoadingItems(false)
        }
    },
        [InfoUser, pk_id_usuario]
    )
    useEffect(() => {
        getListUsuarios()
    }, [getListUsuarios])

    const getListCursos = useCallback(async () => {
        if (loadingItems || Object.keys(InfoUser).length === 0) return
        try {
            setLoadingItems(true)

            const url = urlGetListCourses()
            const { data }: any = await fetchGetRequest(`${url}`)
            // notify(data?.msg ?? "Consulta Exitosa")
            setListCrusos(data?.obj?.results ?? [])
            setLoadingItems(false)

        } catch (e: any) {
            let error = e.message ?? "Error en la consulta"
            notifyError(error)
            setLoadingItems(false)
        }
    },
        [InfoUser]
    )

    useEffect(() => {
        getListCursos()
    }, [getListCursos])

    const onClickItems = useCallback((ev: any, item: any = {}) => {
        try {
            ev.preventDefault()
            if (!["",null].includes(usuario[0]?.fk_id_curso ?? "")) {
                notifyError("El curso ya tiene asignado un curso")
                return
            }
            let copySelectMateria = [...selectMateria]
            copySelectMateria.push({ "pk_id_curso": item?.pk_id_curso ?? "", "nombre_curso": item?.nombre_curso ?? "" })
            setSelectMateria(copySelectMateria)

        } catch (error) {
            console.log(error)
            notifyError("Error al modificar")
        }
    }, [InfoUser, selectMateria, usuario])

    const asignarCursos = useCallback(async (ev: any) => {
        try {
            ev.preventDefault()
            let url = urlAsignarCursos()

            selectMateria.map(async (item: any) => {
                let body = { "pk_id_curso": item?.pk_id_curso, "pk_id_usuario": pk_id_usuario }
                const { data }: any = await fetchPostRequest(url, body)
            })
            setShowModal(false)
            setTimeout(()=>{
                getListUsuarios()
            },1000)
        } catch (error) {
            console.log(error)
            notifyError("Error al modificar")
        }
    }, [InfoUser, selectMateria, pk_id_usuario])

    if (!pk_id_usuario) {
        return <div className="main_page flex min-h-screen flex-col items-center">Cargando..</div>
    }
    return (
        <div className="main_page flex min-h-screen flex-col items-center">
            <button
                className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
                onClick={() => setShowModal(true)}
            >Asignar curso
            </button>

            <TablaModelo
                title={"Usuario selecionado"}
                description=""
                headers={[
                    "Id usuario",
                    "Nombre usuario",
                    "Correo",
                    "Id curso",
                    "Eliminar",
                ]}
                items={usuario.map(({
                    pk_id_usuario,
                    nombre_usuario,
                    correo,
                    fk_id_curso,
                    eliminar,
                }) => ({
                    pk_id_usuario,
                    nombre_usuario: nombre_usuario ?? "",
                    correo: correo ?? "",
                    fk_id_curso: fk_id_curso ?? "Ninguno",
                    eliminar: fk_id_curso ? "eliminar" : "",
                }))}
                footer={[]}
                buttonNext={nextPage ? false : true}
                buttonPrevious={page == 1 ? true : false}
            >
            </TablaModelo>
            <Modal
                showModal={showModal}
                closeModal={() => setShowModal(false)}
            >
                <TablaModelo
                    title={"Tabla de cursos"}
                    description=""
                    headers={[
                        "Id curso",
                        "Nombre curso",
                    ]}
                    items={listCrusos.map(({
                        pk_id_curso,
                        nombre_curso,
                    }) => ({
                        pk_id_curso,
                        nombre_curso: nombre_curso ?? "",
                    }))}
                    footer={[]}
                    onClickItem={onClickItems}
                    buttonNext={nextPage ? false : true}
                    buttonPrevious={page == 1 ? true : false}
                >
                </TablaModelo>

                <div>
                    {selectMateria.map((item: any, index: number) => {
                        return (<h4 className={"dark:text-white"} key={index}>{item?.nombre_curso ?? ""}</h4>)
                    })}
                </div>

                <button
                    className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
                    onClick={(ev) => asignarCursos(ev)}
                >Asignar curso
                </button>
            </Modal>
        </div>
    )
}