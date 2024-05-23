
type Entradas = {
    listPasswords: any;
  };

export default function ChangePass({listPasswords}:Entradas) {
    return (
        <>
            <div className="flex flex-row items-center my-3 justify-evenly">
                <label htmlFor="contra1" className="mx-2 w-40" >Contraseña 1</label>
                <input
                    type="number"
                    id="contra1"
                    name="contra1"
                    value={listPasswords[0] ?? ""}
                    className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="******"
                />
            </div>
            <div className="flex flex-row items-center my-3 justify-evenly">
                <label htmlFor="contra2" className="mx-2 w-40" >Contraseña 2</label>
                <input
                    type="number"
                    id="contra2"
                    name="contra2"
                    value={listPasswords[1] ?? ""}
                    className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="******"
                />
            </div>
        </>
    )
}