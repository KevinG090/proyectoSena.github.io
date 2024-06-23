'use client';
import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";

type Entradas = {
  title: ReactNode;
  onSubmit?: (ev: FormEvent<HTMLFormElement>) => void;
  onChange?: (ev: ChangeEvent<HTMLFormElement>) => void;
  children?: ReactNode;
};

export default function FormModelo(
  {
    title,
    children,
    onSubmit = () => { },
    onChange = () => { }
  }: Entradas
) {

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-x-auto rounded-lg model_table dark:model_table dark:text-gray-800 max-[450px]:w-[25rem] max-[400px]:w-[20rem] md:w-[40rem]">
        <form
          onSubmit={onSubmit}
          onChange={onChange}
          className="p-5 text-lg font-semibold text-center rtl:text-right text-gray-900 model_table dark:text-white dark:model_table "
        >
          {title}
          <div className="mt-7">
            {children && (
              <div className="flex justify-between flex-col relative">
                {children}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
