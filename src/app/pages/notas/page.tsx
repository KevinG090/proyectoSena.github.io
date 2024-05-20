'use client';

import Notas from "@/app/components/Notas";
import { useSearchParams } from 'next/navigation';

import { useState, useEffect, useCallback, useContext, ReactNode } from "react";
import { fetchGetRequest } from "../../utils/fetch"
import { urlGetListNotas } from "../../utils/routes"
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
      console.log("InfoUser",InfoUser)
      console.log("InfoUser?.roleInfo?.tipo_usuario",InfoUser?.roleInfo?.tipo_usuario)
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

  return (
    <main className="main_page flex min-h-screen flex-col items-center">
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
              nombreMateria={nombreMateria}
              nombreCurso={nombreCurso}
              nombreUsuario={nombreUsuario}
              notas={listaNotas}
            />
          })
        }
      </div >
    </main>
  );
}
