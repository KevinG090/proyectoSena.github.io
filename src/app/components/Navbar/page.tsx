import Image from "next/image";
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()

  return <div className="flex mb-12" >
    <Image
      className="cursor-pointer absolute top-2 left-2"
      src="/menu.png"
      alt="welcome"
      width={20}
      height={20}
      priority
      onClick={() => console.log("click")}
    />
    <button
      className="absolute bg-backg-inputs-red rounded-inputs py-1 px-5 right-3 top-2"
      onClick={() => router.push('/pages/main')}
    >{/* Inicio */}
    </button>
      
    <button
      className="absolute bg-backg-inputs-submit rounded-inputs py-1 px-5 right-3 top-6"
      onClick={() => router.push('/')}
    >{/* Cerrar Sesión */}
    </button>

  </div>
}