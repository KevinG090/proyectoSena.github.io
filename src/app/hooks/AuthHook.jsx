'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Home from '../page';

const initialUser = {
  setInfoLogout:(dict)=> {},
  updateUserInfo:(dict)=> {},
  isSignedIn: false,
  userInfo: {},
  roleInfo: null,
  userPermissions: [],
};

export const infoContext = createContext({
  ...initialUser,
});

export const UserInfoProvider = ({ children }) => {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState(initialUser);

  const updateUserInfo = (updatedInfo) => {
    setUserInfo((prevInfo) => ({ ...prevInfo, ...updatedInfo }));
  };

  useEffect(() => {
    if (
      (userInfo?.isSignedIn ?? false) == false &&
      localStorage.getItem("userLogin") == "true"
    ) updateUserInfo({ isSignedIn: true });
    else if ((!userInfo?.isSignedIn ?? false) && localStorage.getItem("userLogin") == "false") router.push('/')
    else (router.push('/pages/main'))
  }, [userInfo])

  const setInfoLogout = () => {
    localStorage.setItem("userLogin", false);
    updateUserInfo({ isSignedIn: false, userInfo: null });
    router.push('/')
  }

  return (
    <infoContext.Provider value={{ userInfo, updateUserInfo, setInfoLogout }}>
      {(!userInfo?.isSignedIn ?? false) ? (
        <Home />
      ) : (children)}
    </infoContext.Provider>
  );
};
