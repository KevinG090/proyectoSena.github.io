'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import Home from '../page';
import { fetchGetRequest } from "../utils/fetch"
import { urlUser } from "../utils/routes"
import RoutePermisions from "../utils/permission"


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

  useEffect(() => {
    // console.log(path == "/pages/users/create-users")
    // console.log(`'${path}'`,String(path).replace(" ","") in Object.keys(allPermisions))
    if (!(path in Object.keys(allPermisions)) || localStorage.getItem("userLogin") != "true") return
    else if (allPermisions[path]["permisions"][0] == "*") return
    // console.log(allPermisions[path]["permisions"])

    let validate = false
    for (permiso in userInfo?.userPermissions?.permisos ?? []) {
      if (permiso in allPermisions[path]["permisions"]) validate = true
    }

    if (
      !validate &&
      allPermisions[path]["typeUsers"][0] != "*" &&
      userInfo?.roleInfo?.tipo_usuario in allPermisions[path]["typeUsers"]
    ) {
      allPermisions[path]["typeUsers"]
    }

    if (!validate){
      router.push('/pages/main')
    }

  }, [
    path,allPermisions, userInfo?.userPermissions?.permisos, userInfo?.roleInfo?.tipo_usuario
  ])

  const getInfo = () => {
    return userInfo
  }

  useEffect(() => {
    if (
      (userInfo?.isSignedIn ?? false) == false &&
      localStorage.getItem("userLogin") == "true"
    ) updateUserInfo({ isSignedIn: true });
    else if ((!userInfo?.isSignedIn ?? false) && localStorage.getItem("userLogin") == "false") router.push('/')
    // else (router.push('/pages/main'))
  }, [userInfo])

  const setInfoLogout = () => {
    localStorage.setItem("userLogin", false);
    localStorage.setItem("id_usuario", null);
    updateUserInfo({ isSignedIn: false, userInfo: null });
    router.push('/')
  }

  return (
    <infoContext.Provider value={{ userInfo, updateUserInfo, setInfoLogout, getInfo }}>
      {
        ([{}, null, false].includes(userInfo?.userInfo?.id_usuario ?? false) && (userInfo?.isSignedIn ?? false)) ?
          (<>Cargando...</>) :
          (!userInfo?.isSignedIn ?? false) ? (
            <Home />
          ) : (children)
      }
    </infoContext.Provider>
  );
};
