import { infoContext } from "../hooks/AuthHook"
import { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from 'next/navigation'
import CryptoJS from "crypto-js";

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

export const cifrarAES = (llave, iv, body) => {
    let texto = JSON.stringify(body);
    const derived_key = CryptoJS.enc.Base64.parse(llave);
    iv = CryptoJS.enc.Utf8.parse(iv);
    return CryptoJS.AES.encrypt(texto, derived_key, {
        iv: iv,
    }).toString();
};
export const decryptAES = (llave, iv, data) => {
    let dataSin64 = CryptoJS.enc.Base64.parse(data);
    dataSin64 = CryptoJS.enc.Base64.stringify(dataSin64);
    const derived_key = CryptoJS.enc.Base64.parse(llave);
    iv = CryptoJS.enc.Utf8.parse(iv);
    const encrypted = CryptoJS.AES.decrypt(dataSin64, derived_key, {
        iv: iv,
    }).toString(CryptoJS.enc.Utf8);
    return encrypted;
};
