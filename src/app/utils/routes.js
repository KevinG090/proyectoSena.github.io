
const ulrBaseApi = process.env.NEXT_PUBLIC_BK_BASE_FAST_API

// <<------- Cursos -------->>
export const urlGetListCourses = () => {
    return `${ulrBaseApi}/cursos/listar-cursos`
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