'use client';

export default function Notas({ item = "", fecha = "", notas = [{val:0}] }) {
  return (
    <div className="relative flex flex-col bg-backg-container-blue rounded-inputs p-3 mt-3 w-48 min-[320px]:w-18 md:w-96">

      <div className="relative flex flex-row place-items-center justify-between">
        <h5 className="relative place-items-left text-xs">{item}</h5>
        <h5 className="relative place-items-rigth text-dates">{fecha}</h5>
      </div>

    <div className="grid grid-cols-2 rounded-inputs md:grid-cols-3 lg:grid-cols-4 gap-4">
      {notas.map((item,i)=>{
        return (
          <div key={i} className="bg-background-main-page rounded-inputs p-2">
            <h5 className="flex text-center md:text-center text-xs">Nota {i+1}: {item?.val ?? 0}</h5>
          </div>
        )
      })}

    </div>

    </div>
  )
}