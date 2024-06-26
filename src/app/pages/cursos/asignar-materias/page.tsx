'use client';

import TablaModelo from "@/app/components/TablaModelo";
import Modal from "@/app/components/Modal";

import { useRouter, useSearchParams } from 'next/navigation'

import { useState, useEffect, useCallback, useContext, ReactNode } from "react";
import { fetchGetRequest, fetchPostRequest, fetchDeleteRequest } from "../../../utils/fetch"
import { urlGetListMateriasCursos, urlGetListMaterias, urlAsignarMaterias, urlEliminarRelacionCursoMateria } from "../../../utils/routes"
import { notify, notifyError } from "../../../utils/notify"
import { infoContext } from "../../../hooks/AuthHook";

export default function page({ params }: { params: { id: string } }) {
    const router = useRouter()
    const routerParams = useSearchParams();
    const pk_id_curso = routerParams.get('pk_id_curso');


    useEffect(() => {
        if (!pk_id_curso) router.push("/pages/cursos")
    }, [pk_id_curso])


    const { getInfo } = useContext(infoContext);
    const [InfoUser, setInfoUser] = useState<any>({});

    const [materiasCursos, setMateriasCursos] = useState([])
    const [listMaterias, setListMaterias] = useState([])
    const [loadingItems, setLoadingItems] = useState(false)

    const [selectMateria, setSelectMateria] = useState<any>([]);
    const [deleteRelation, setDeleteRelation] = useState<any>({});

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<any | number>(20)
    const [nextPage, setNextPage] = useState(false)

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        let res: any = getInfo()
        setInfoUser(res ?? {})
    }, [getInfo])

    const getListMateriasCursos = useCallback(async () => {
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
            // notify(data?.msg ?? "Consulta Exitosa")
            setMateriasCursos(data?.obj?.results ?? [])
            setLoadingItems(false)

        } catch (e: any) {
            let error = e.message ?? "Error en la consulta"
            notifyError(error)
            setLoadingItems(false)
        }
    },
        [InfoUser, pk_id_curso]
    )
    useEffect(() => {
        getListMateriasCursos()
    }, [getListMateriasCursos])

    const getListMaterias = useCallback(async () => {
        if (loadingItems || Object.keys(InfoUser).length === 0) return
        try {
            setLoadingItems(true)

            const url = urlGetListMaterias()
            const { data }: any = await fetchGetRequest(`${url}`)
            // notify(data?.msg ?? "Consulta Exitosa")
            setListMaterias(data?.obj?.results ?? [])
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
        getListMaterias()
    }, [getListMaterias])

    const onClickItems = useCallback((ev: any, item: any = {}) => {
        try {
            ev.preventDefault()
            if (materiasCursos.some((materia: any) => materia.pk_id_materia == item?.pk_id_materia)) {
                notifyError("El curso ya tiene asignado esta materia")
                return
            }
            let copySelectMateria = [...selectMateria]
            copySelectMateria.push({ "pk_id_materia": item?.pk_id_materia ?? "", "nombre_materia": item?.nombre_materia ?? "" })
            setSelectMateria(copySelectMateria)

        } catch (error) {
            console.log(error)
            notifyError("Error al modificar")
        }
    }, [InfoUser, selectMateria, materiasCursos])

    const asignarMaterias = useCallback(async (ev: any) => {
        try {
            ev.preventDefault()
            let url = urlAsignarMaterias()

            selectMateria.map(async (item: any) => {
                let body = { "pk_id_materia": item?.pk_id_materia, "pk_id_curso": pk_id_curso }
                const { data }: any = await fetchPostRequest(url, body)
            })
            setShowModal(false)
            await getListMateriasCursos()
        } catch (error) {
            console.log(error)
            notifyError("Error al modificar")
        }
    }, [InfoUser, selectMateria, pk_id_curso])

    const eliminarRelacion = useCallback(async (ev: any) => {
        try {
            ev.preventDefault()
            let url = urlEliminarRelacionCursoMateria()

            let body = { "fk_id_materia": deleteRelation?.pk_id_materia, "fk_id_curso": deleteRelation?.pk_id_curso }
            const { data }: any = await fetchDeleteRequest(url, body)
            setDeleteRelation({})
            await getListMateriasCursos()
        } catch (error) {
            console.log(error)
            notifyError("Error al modificar")
        }
    }, [InfoUser, deleteRelation, getListMateriasCursos])

    if (!pk_id_curso) {
        return <div className="main_page flex min-h-screen flex-col items-center">Cargando..</div>
    }
    return (
        <div className="main_page flex min-h-screen flex-col items-center">
            <button
                className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
                onClick={() => setShowModal(true)}
            >Asignar materia
            </button>

            <TablaModelo
                title={"Tabla de materias asignadas"}
                description=""
                headers={[
                    "Id materia",
                    "Nombre materia",
                    "Id curso",
                    "Nombre curso",
                    "Eliminar",
                ]}
                items={materiasCursos.map(({
                    pk_id_materia,
                    nombre_materia,
                    pk_id_curso,
                    nombre_curso,
                    eliminar,
                }) => ({
                    pk_id_materia,
                    nombre_materia: nombre_materia ?? "",
                    pk_id_curso: pk_id_curso ?? "",
                    nombre_curso: nombre_curso ?? "",
                    eliminar: eliminar ?? "eliminar",
                }))}
                deleteItem={(ev, data) => {
                    ev.preventDefault()
                    setDeleteRelation(data)
                }}
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
                    title={"Tabla de materias"}
                    description=""
                    headers={[
                        "Id materia",
                        "Nombre materia",
                    ]}
                    items={listMaterias.map(({
                        pk_id_materia,
                        nombre_materia,
                    }) => ({
                        pk_id_materia,
                        nombre_materia: nombre_materia ?? "",
                    }))}
                    footer={[]}
                    onClickItem={onClickItems}
                    buttonNext={nextPage ? false : true}
                    buttonPrevious={page == 1 ? true : false}
                >
                </TablaModelo>

                <div>
                    {selectMateria.map((item: any, index: number) => {
                        return (<h4 className={"dark:text-white"} key={index}>{item?.nombre_materia ?? ""}</h4>)
                    })}
                </div>

                <div className="flex justify-around rounded-inputs py-5 px-5 ">
                    <button
                        className="flex justify-center bg-backg-container-gray rounded-inputs my-3 py-1 px-5 w-40"
                        onClick={(ev) => asignarMaterias(ev)}
                    >Asignar materia
                    </button>
                    <button
                        className="flex justify-center bg-backg-container-gray rounded-inputs my-3 py-1 px-5 w-40"
                        onClick={(ev) => setSelectMateria([])}
                    >Reset
                    </button>
                </div>
            </Modal>
            <Modal
                showModal={(Object.keys(deleteRelation ?? {}).length >= 1)}
                closeModal={() => setDeleteRelation([])}
            >
                <div>
                    <h2>¿Esta seguro de eliminar la relacion del curso y materia?</h2>
                    <p>Id Curso: {deleteRelation?.pk_id_curso}</p>
                    <p>Id Materia: {deleteRelation?.pk_id_materia}</p>
                </div>
                <button
                    className="flex justify-center bg-backg-container-gray rounded-inputs my-3 py-1 px-5 w-40"
                    onClick={(ev) => eliminarRelacion(ev)}
                >Eliminar
                </button>
            </Modal>
        </div>
    )
}