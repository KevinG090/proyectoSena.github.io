import { infoContext } from "../hooks/AuthHook"
import { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from 'next/navigation'


export const setInfoLogin = (info) => {
    const { userInfo, updateUserInfo } = useContext(infoContext);
    const router = useRouter()
    updateUserInfo({ isSignedIn: true, userInfo: { name: 'John Doe' } });
    router.push('/pages/main')
}

export const setInfoLogout = (info) => {
    updateUserInfo({ isSignedIn: false, userInfo: null });
    router.push('/')
}
