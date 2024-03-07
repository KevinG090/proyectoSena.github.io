'use client';

import { useRouter } from 'next/navigation'
import { createContext, useContext, useState } from "react";

let initialUser = {
  isSignedIn: false,
  userInfo: {},
  roleInfo: null,
  quotaInfo: null,
  userPermissions: [],
  commerceInfo: null,
};

export const infoContext = createContext({
  ...initialUser
})

export const infoUser = () => {
  return useContext(infoContext)
}
