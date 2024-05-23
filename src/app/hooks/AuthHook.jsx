'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import Home from '../page';
import { fetchGetRequest } from "../utils/fetch"
import { urlUser } from "../utils/routes"
import RoutePermisions from "../utils/permission"
import { notify, notifyError } from "../utils/notify"

const initialUser = {
  setInfoLogout: (dict) => { },
  getInfo: () => { },
  updateUserInfo: (dict) => { },
  isSignedIn: false,
  userInfo: {},
  roleInfo: {},
  userPermissions: [],
};

export const infoContext = createContext({
  ...initialUser,
});

export const UserInfoProvider = ({ children }) => {
  const router = useRouter()
  const path = usePathname()
  const allPermisions = RoutePermisions()

  const [userInfo, setUserInfo] = useState(initialUser);
  const [loading] = useState("Cargando...");

  useEffect(() => {
    if (
      (userInfo?.isSignedIn ?? false) == false &&
      localStorage.getItem("userLogin") == "true"
    ) updateUserInfo({ isSignedIn: true });
    else if (
      !(userInfo?.isSignedIn ?? false) &&
      localStorage.getItem("userLogin") == "false"
    ) router.push('/')
    else if (
      (userInfo?.isSignedIn ?? false) == "true" &&
      localStorage.getItem("userLogin") == "true" &&
      path == "/"
    ) router.push('/pages/main')

  }, [userInfo])

  const updateUserInfo = (updatedInfo) => {
    setUserInfo((prevInfo) => ({ ...prevInfo, ...updatedInfo }));
  };

  const searchInfoUser = useCallback(async () => {
    let usuario = localStorage.getItem("id_usuario")
    if (!["", "null", null, false].includes(usuario)) {
      const url = urlUser()
      const { data } = await fetchGetRequest(`${url}?pk_id_usuario=${usuario}`)
      updateUserInfo({
        userInfo: {
          nombre_usuario: data?.obj?.nombre_usuario ?? "",
          id_usuario: data?.obj?.pk_id_usuario ?? null,
          nombre_tipo_usuario: data?.obj?.nombre_tipo_usuario ?? "",
          correo: data?.obj?.correo ?? "",
          identificacion: data?.obj?.identificacion ?? "",
          nombre_curso: data?.obj?.nombre_curso ?? "",
          pk_id_curso: data?.obj?.pk_id_curso ?? "",
        },
        roleInfo: {
          tipo_usuario: data?.obj?.pk_id_tipo_usuario ?? "",
        },
        userPermissions: {
          permisos: data?.obj?.permisos ?? [],

        }
      });
    }

  }, [
    userInfo?.userInfo?.id_usuario,
  ])

  useEffect(() => {
    searchInfoUser()
  }, [searchInfoUser])

  const getInfo = () => {
    return userInfo
  }

  useEffect(() => {
    if (Object.keys(userInfo?.userInfo ?? {}).length < 1) return

    if (!(Object.keys(allPermisions).includes(path)) || localStorage.getItem("userLogin") != "true") return
    else if (allPermisions[path]["permisions"][0] == "*" && allPermisions[path]["typeUsers"][0] == "*") return

    let validate = false
    for (permiso in userInfo?.userPermissions?.permisos ?? []) {
      if (allPermisions[path]["permisions"].includes(permiso)) validate = true
    }

    if (!validate && allPermisions[path]["typeUsers"][0] != "*" && (allPermisions[path]["typeUsers"].includes(userInfo?.roleInfo?.tipo_usuario))) {
      validate = true
    }

    if (!validate) {
      router.push('/pages/main')
      notifyError("Usuario sin permisos", 1000)
    }

  }, [
    path, allPermisions, userInfo?.userPermissions?.permisos, userInfo?.roleInfo?.tipo_usuario
  ])

  const setInfoLogout = () => {
    localStorage.setItem("userLogin", false);
    localStorage.setItem("id_usuario", null);
    updateUserInfo({ isSignedIn: false, userInfo: null });
    router.push('/')
  }
  if (Object.keys(userInfo?.userInfo ?? {}).length < 1) {
    return <infoContext.Provider value={{ userInfo, updateUserInfo, setInfoLogout, getInfo }}>
      <div className="flex min-h-screen flex-col items-center justify-around p-20 sm:flex-row">
        <p>Cargando...</p>
      </div>
    </infoContext.Provider>
  }

  return (
    <infoContext.Provider value={{ userInfo, updateUserInfo, setInfoLogout, getInfo }}>
      {
        (typeof window !== "undefined") ? (
          (!(userInfo?.isSignedIn ?? false) && (window.localStorage.getItem("userLogin")) == "true") ? (
            <div className="main_page login flex min-h-screen flex-col items-center justify-around p-20 sm:flex-row">
              <p>{loading ?? ""}</p>
            </div>
          ) : ([{}, null, false].includes(userInfo?.userInfo?.id_usuario ?? false) && (userInfo?.isSignedIn ?? false)) ? (
            <div className="main_page login flex min-h-screen flex-col items-center justify-around p-20 sm:flex-row">
              <p>{loading ?? ""}</p>
            </div>
          ) : (
            (window.localStorage.getItem("userLogin")) == "false") ? (<Home />) : (children)
        ) : (
          <></>
        )
      }
    </infoContext.Provider>
  );
};
