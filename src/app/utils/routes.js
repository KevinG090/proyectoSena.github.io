
const ulrBaseApi = process.env.NEXT_PUBLIC_BK_BASE_FAST_API
// const ulrBaseApi = "http://127.0.0.1:8000/api"

// <<------- Cursos -------->>
export const urlGetListCourses = () => {
    return `${ulrBaseApi}/cursos/listar-cursos`
}

// <<------- Eventos -------->>
export const urlGetListEvents = () => {
    return `${ulrBaseApi}/eventos/listar-eventos`
}

// <<------- Usuarios -------->>
export const urlGetListUsers = () => {
    return `${ulrBaseApi}/users/listar-usuarios`
}

// <<------- Materias -------->>
export const urlGetListMaterias = () => {
    return `${ulrBaseApi}/materias/listar-materias`
}

// <<------- login -------->>
export const urlLogin = () => {
    return `${ulrBaseApi}/login/verify`
}
export const urlUser = () => {
    return `${ulrBaseApi}/login/user`
}