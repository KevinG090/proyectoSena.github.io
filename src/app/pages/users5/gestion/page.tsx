'use client';

import React from "react";
import ConfigUsers from "@/app/components/ConfigUsers";
import { useSearchParams  } from 'next/navigation';

export default function page({ params }: { params: { id: string } }) {
    const routerParams = useSearchParams ();
    const pk_id_usuario = routerParams.get('pk_id_usuario');

    return <div>
        <ConfigUsers id_usuario={params?.id ?? pk_id_usuario ?? null}/>
    </div>

}