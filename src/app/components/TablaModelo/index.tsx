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
  items: Record<string, any>[];
  onSubmit?: (ev: FormEvent<HTMLFormElement>) => void;
  onChange?: (ev: ChangeEvent<HTMLFormElement>) => void;
  editItem?: (ev: MouseEvent<HTMLTableRowElement> | any, data: any) => void;
  asignarItem?: (ev: MouseEvent<HTMLTableRowElement> | any, data: any) => void;
  deleteItem?: (ev: MouseEvent<HTMLTableRowElement> | any, data: any) => void;
  onClickRow?: (ev: MouseEvent<HTMLTableRowElement> | any, data: string) => void;
  onClickItem?: (ev: MouseEvent<HTMLTableRowElement> | any, data: any) => void;
  onChangePageLimit?: (ev: ChangeEvent<HTMLFormElement> | ChangeEvent<HTMLSelectElement>, data: string) => void;
  children?: ReactNode;
  headers: ReactNode[];
  footer: ReactNode;
  buttonNext: boolean,
  buttonPrevious: boolean,
  description: string | "";
};

export default function TablaModelo(
  {
    title,
    items,
    children,
    footer,
    headers,
    editItem = (ev, data) => { },
    asignarItem = (ev, data) => { },
    deleteItem = (ev, data) => { },
    onClickRow = (ev, data) => { },
    onChangePageLimit = (ev, data) => { },
    onClickItem = (ev, data) => { },
    buttonNext = true,
    buttonPrevious = true,
    description = "",
  }: Entradas
) {

  return (
    <div className="relative overflow-x-auto rounded-lg model_table dark:model_table dark:text-gray-800 max-[570px]:w-[25rem] max-[750px]:w-[32rem] max-[400px]:w-[20rem] md:w-[40rem]">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
        <caption className="p-5 text-lg font-semibold text-center rtl:text-right text-gray-900 model_table dark:text-white dark:model_table ">
          {title}
          {description != "" && (
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">{description}</p>
          )}
          <div className="mt-7">
            {children && (
              <div className="relative">
                {children}
              </div>
            )}
          </div>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((val, index) => {
              return <th key={index} scope="col" className="px-6 py-3">{val}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {!items.length || !items ? (
            <tr>
              <th></th>
              <th>No hay datos</th>
              <th></th>
            </tr>
          ) : (
            items.map((item, index) => {
              if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                return (
                  <tr
                    key={index}
                    className="model_table border-b dark:model_table dark:border-gray-700 cursor-pointer"
                  >
                    {Object.values(item).map((value, i) => {
                      if (i > (headers.length - 1)) return
                      if (value == "editar") {
                        return <th
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:bg-gray-700"
                          onClick={ev => editItem(ev, item)}
                        >
                          Editar
                        </th>
                      }

                      if (value == "asignar") {
                        return <th
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:bg-gray-700"
                          onClick={ev => asignarItem(ev, item)}
                        >
                          Asignar
                        </th>
                      }
                      if (value == "eliminar") {
                        return <th
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:bg-gray-700"
                          onClick={ev => deleteItem(ev, item)}
                        >
                          Eliminar
                        </th>
                      }

                      return (
                        <th
                          key={`${index}-${i}`}
                          scope="row"
                          onClick={ev => onClickItem(ev, item)}
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {value}
                        </th>
                      )
                    })}
                  </tr>
                )
              }
            }
            )
          )}
        </tbody>
      </table>
      <form
        className="flex items-center flex-column flex-wrap md:flex-row justify-between bg-gray-50 dark:bg-gray-700"
        aria-label="Table formigation"
        autoComplete="off"
      >
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 my-2 ml-5">
          <li>
            <button
              id="prev"
              name="prev"
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 model_table border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:model_table dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={(ev) => { onClickRow(ev, "prev") }}
              disabled={buttonPrevious}
            >
              Previous
            </button>
          </li>
          <li>
            <button
              id="next"
              name="next"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 model_table border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:model_table dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={(ev) => { onClickRow(ev, "next") }}
              disabled={buttonNext}
            >
              Next
            </button>
          </li>
        </ul>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 my-2">
          <li className="flex flex-row items-center my-3 mx-3 justify-center">
            <label htmlFor="limit" className="mx-2 text-gray-100 dark:model_table">Limit</label>
            <select
              id="limit"
              name="limit"
              className="block w-[4rem] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:model_table dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(ev) => { onChangePageLimit(ev, "limit") }}
            >
              <option selected value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </li>
        </ul>
      </form>
    </div>

  )
}

