'use client';

import React, {
  MouseEvent,
  useEffect,
  useContext,
  useState,
} from "react";
import { infoContext } from "../../hooks/AuthHook";
import TipoUsuarios from "../../utils/enum";

type Entradas = {
  data?: Object|any,
  nombreMateria?: string,
  nombreCurso?: string,
  nombreUsuario?: string,
  notas?: Record<string, any>[],
  onClickButton?: (ev: MouseEvent<HTMLTableRowElement> | any, item:any, data: any) => void;
};

export default function Notas({
  data = {},
  nombreMateria = "",
  nombreCurso = "",
  nombreUsuario = "",
  notas = [],
  onClickButton = () => { },
}: Entradas
) {
  const { getInfo } = useContext(infoContext);
  const [InfoUser, setInfoUser] = useState<any>({});

  useEffect(() => {
    let res: any = getInfo()
    setInfoUser(res ?? {})
  }, [getInfo])

  return (
    <div className="relative flex flex-col bg-backg-container-blue rounded-inputs p-3 mt-3 w-48 min-[320px]:w-18 md:w-96">

      <div className="relative flex flex-row place-items-center justify-between">
        <h5 className="relative place-items-left text-xs">{nombreMateria}</h5>
        <h5 className="relative place-items-rigth text-dates">{nombreCurso}</h5>
      </div>
      <div className="relative flex flex-col place-items-center justify-between">
        <h6 className="relative place-items-left text-xs">Nombre: {nombreUsuario}</h6>
      </div>

      <div className="grid grid-cols-2 rounded-inputs md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notas.map((item, i) => {
          return (
            <div key={i} className="bg-background-main-page rounded-inputs p-2">
              <h5 className="flex text-center md:text-center text-xs">Nota {i + 1}: {parseFloat(String(item ?? 0)).toFixed(1)}</h5>
            </div>
          )
        })}
      </div>
      {[TipoUsuarios.PROFESOR].includes(InfoUser?.roleInfo?.tipo_usuario ?? "") && (
        <div className="flex flex-row place-items-center justify-around mt-3">
          <button 
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          onClick={ev => onClickButton(ev, "crear",data)}>crear</button>
          <button
          className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-40"
          onClick={ev => onClickButton(ev, "editar",data)}>editar</button>
        </div>
      )}
    </div>
  )
}