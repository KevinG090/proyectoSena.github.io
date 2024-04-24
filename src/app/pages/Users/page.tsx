'use client';
import TablaModelo from "@/app/components/TablaModelo";

export default function page() {
  return (
    <main className="main_page flex min-h-screen flex-col items-center">
      {/* <div className="relative flex flex-row bg-backg-container-blue place-items-center rounded-inputs px-6 py-1 mb-4">
        <h5 className="relative place-items-left text-xs">Usuarios</h5>
      </div> */}
      <TablaModelo
        title={"Tabla de Usuarios"}
        description=""
        headers={[
          "Id de usuario",
          "Nombre",
          "Tipo de usuario",
        ]}
        items={[
          { "id": 1, "nombre": "pepito", "tipo": "estudiante" },
          { "id": 1, "nombre": "pepito", "tipo": "estudiante" }
        ]}
        footer={[]}
      >
        <div className="flex flex-row items-center my-3">
          <label htmlFor="user_name" className="mx-2" >Nombre</label>
          <input
            type="text"
            id="user_name"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for name"
          />
        </div>
      </TablaModelo>

    </main>
  )
}
