'use client';

export default function Event({item = "",fecha = "",contenido = ""}) {
  return (
    <div className="flex flex-col bg-backg-container-blue place-items-center p-5">

        <div className="flex relative ">
            <h5 className="place-items-left">{item}</h5>
            <h5 className="place-items-rigth">{fecha}</h5>
        </div>

        <div className="flex bg-background-main-page place-items-center justify-between">
            <div className="flex relative">
                <h5>{contenido}</h5>
            </div>
        </div>
    </div>
  )
}
