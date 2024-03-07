import Image from "next/image";
import FormLogin from '@/app/formLogin'

export default function Home() {
  return (
    <main className="main_page login flex min-h-screen flex-col items-center justify-between p-20">
      <div className="relative flex place-items-center">
        <Image
          className="relative "
          src="/undraw_Welcoming_re_x0qo.png"
          alt="menu"
          width={200}
          height={50}
          priority
        />
      </div>
      <FormLogin />
    </main>
  );
}
