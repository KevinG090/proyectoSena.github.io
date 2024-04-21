// const axios = require('axios').default;
import axios from 'axios'
import { useEffect, useState } from 'react'

export const fetchGetRequest = async (url,params = {}) => {
    try {
        // let queries = params != {} ? new URLSearchParams(params.entries()).toString(): "";
        const config_request = {
            headers : {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }
        }
        let response = await axios.get(url,config_request)
        return response
    }
    catch (e) {
        throw `Error al consultar ${e}`
    }
}
