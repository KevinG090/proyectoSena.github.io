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
  onClickRow?: (ev: MouseEvent<HTMLTableRowElement>, index: number) => void;
  children?: ReactNode;
  headers: ReactNode[];
  footer: ReactNode;
  description: string | "";
};

export default function TablaModelo(
  {
    title,
    items,
    children,
    footer,
    headers,
    description = "",
  }: Entradas
) {

  console.log(items)
  return (
    <div className="relative overflow-x-auto rounded-lg model_table dark:model_table dark:text-gray-800 max-[450px]:w-[25rem] max-[400px]:w-[20rem] md:w-[40rem]">
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
            <>No hay datos</>
          ) : (
            items.map((item, index) => {
              if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                return (
                  <tr className="model_table border-b dark:model_table dark:border-gray-700">
                    {Object.values(item).map((value) => {
                      return (
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer">
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
      <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between bg-gray-50 dark:bg-gray-700" aria-label="Table navigation">
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 my-2 ml-5">
          <li>
            <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 model_table border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:model_table dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
          </li>
          <li>
            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 model_table border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:model_table dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
          </li>
        </ul>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 my-2 mr-5">
          <li>
            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 model_table border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:model_table dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">Limit</a>
          </li>
        </ul>
      </nav>
    </div>

  )
}

// <div className="relative overflow-x-auto sm:rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-800">
// <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//   <caption className="p-5 text-lg font-semibold text-center rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
//     {title}
//     {/* <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p> */}
//     <div className="mt-7">
//       <label htmlFor="table-search" className="sr-only">Search</label>
//       <div className="relative">
//         <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
//           <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
//         </div>
//         <input type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
//       </div>
//     </div>
//   </caption>
//   <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//     <tr>
//       <th scope="col" className="px-6 py-3">
//         Product name
//       </th>
//       <th scope="col" className="px-6 py-3">
//         Color
//       </th>
//       <th scope="col" className="px-6 py-3">
//         Category
//       </th>
//       <th scope="col" className="px-6 py-3">
//         Price
//       </th>
//       <th scope="col" className="px-6 py-3">
//         Action
//       </th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//       <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//         Apple MacBook Pro 17"
//       </th>
//       <td className="px-6 py-4">
//         Silver
//       </td>
//       <td className="px-6 py-4">
//         Laptop
//       </td>
//       <td className="px-6 py-4">
//         $2999
//       </td>
//       <td className="px-6 py-4">
//         <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
//       </td>
//     </tr>
//   </tbody>
// </table>
// <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between" aria-label="Table navigation">
//   <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 my-2 ml-5">
//     <li>
//       <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
//     </li>
//     <li>
//       <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
//     </li>
//   </ul>
//   <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 my-2 mr-5">
//     <li>
//       <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Limit</a>
//     </li>
//   </ul>
// </nav>
// </div>