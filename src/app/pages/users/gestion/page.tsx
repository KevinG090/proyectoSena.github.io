'use client';

import React, { useContext, useState, useEffect } from "react";
import ConfigUsers from "@/app/components/ConfigUsers";
import { useSearchParams } from 'next/navigation';
import { infoContext } from "../../../hooks/AuthHook";

export default function page({ params }: { params: { id: string } }) {
    const routerParams = useSearchParams();
    const pk_id_usuario = routerParams.get('pk_id_usuario');

    const { getInfo } = useContext(infoContext);
    const [InfoUser, setInfoUser] = useState<any>({});
    const [notModifyPass, setnotModifyPass] = useState<boolean>(true);

    useEffect(() => {
        let res: any = getInfo()
        setInfoUser(res ?? {})
    }, [getInfo])

    if (Object.keys(InfoUser).length < 1) {
        return <>Cargando..</>
    }

    return <div className="flex flex-col items-center my-3 justify-evenly">
        {
            (
                String(params?.id ?? pk_id_usuario ?? "--") == String(InfoUser?.userInfo?.id_usuario ?? "")
            ) && (
                <button
                    className="flex justify-center bg-backg-container-blue rounded-inputs  py-1 px-5 w-[30rem] mb-5"
                    onClick={e => setnotModifyPass(old => !old)}
                    // type="submit"
                >
                    {(notModifyPass ? "Habilitar" : "Desahabilitar") + " modificacion de contraseña"}
                </button>
            )
        }
        <ConfigUsers id_usuario={params?.id ?? pk_id_usuario ?? null} only_pass={notModifyPass} />
    </div>

}