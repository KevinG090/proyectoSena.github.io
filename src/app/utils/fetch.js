import axios from 'axios'

let temp_headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
}

export const fetchGetRequest = async (url, params = {}) => {
    try {
        const config_request = {
            headers: {...temp_headers}
        }
        let response = await axios.get(url, config_request)
        return response
    }
    catch (e) {
        throw e?.response?.data?.msg ?? `Error al consultar ${e}`
    }
}

export const fetchPostRequest = async (url, body = {}) => {
    try {
        let response = await axios({
            method: 'post',
            url: url,
            data: body,
            headers:temp_headers
        })
        return response
    }
    catch (e) {
        throw e?.response?.data?.msg ?? `Error en la peticion ${e}`
    }
}
