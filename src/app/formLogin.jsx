'use client';

import { useRouter } from 'next/navigation'

export default function FormLogin() {
  const router = useRouter()

  const createInvoice = async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.currentTarget);
    const body = Object.fromEntries(Object.entries(Object.fromEntries(formData)))
    router.push('/pages/main')
  };

  return (
    <form
      className="relative flex flex-col place-items-center"
      onSubmit={createInvoice}
    >
      <div className="form-login relative flex flex-col place-items-left my-10">
        <label htmlFor="email">Correo <b>*</b></label>
        <input
          className="bg-backg-inputs rounded-inputs mt-2 py-1 px-5"
          type="text"
          name="email"
          id="email"
          required
        />
      </div>
      <div className="form-login relative flex flex-col place-items-left mt-5 mb-10">
        <label htmlFor="pass">Contraseña <b>*</b></label>
        <input
          type="text"
          name="pass"
          id="pass"
          className="bg-backg-inputs rounded-inputs mt-2 py-1 px-5"
          required
        />
      </div>
      <div className="relative flex place-items-center">
        <button
          type="submit"
          className="flex bg-backg-inputs-submit rounded-inputs py-1 px-5"
        >
          Iniciar Sesión
        </button>
      </div>
    </form>
  );
}
