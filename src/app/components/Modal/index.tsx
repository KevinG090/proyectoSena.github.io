'use client';

import Image from "next/image";
import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";

type Entradas = {
  showModal: boolean;
  onSubmit?: (ev: FormEvent<HTMLFormElement>) => void;
  closeModal?: (ev: MouseEvent<HTMLTableRowElement> | any, data: any) => void;
  children?: ReactNode;
};

export default function Modal(
  {
    showModal,
    children,
    onSubmit = () => { },
    closeModal = () => { }
  }: Entradas
) {

  return (
    <div
      className={"custom_modal flex flex-col justify-center items-center fixed right-0 top-0 w-full h-screen " + (showModal ? "z-50" : "z-[-1]")}
    >

      <div className="flex flex-col items-center top-2/4 border-8 border-gray-400 overflow-x-auto rounded-lg model_table dark:model_table dark:text-gray-800 max-[450px]:w-[25rem] max-[400px]:w-[20rem] md:w-[40rem]">
        <div className="w-full flex flex-col items-end">
          <Image
            className="rounded-full cursor-pointer m-2"
            src="/boton-eliminar.png"
            alt="borrar"
            width={35}
            height={40}
            priority
            onClick={ev => closeModal(ev, "close")}
          />
        </div>
        {children}
      </div>
    </div>
  )
}
