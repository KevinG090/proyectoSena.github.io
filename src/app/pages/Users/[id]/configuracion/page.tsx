'use client';

import React from "react";
import ConfigUsers from "@/app/components/ConfigUsers";

export default function page({ params }: { params: { id: string } }) {
    return <div>
        <ConfigUsers id_usuario={params?.id ?? null}/>
    </div>

}