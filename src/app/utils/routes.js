
const ulrBaseApi = process.env.NEXT_PUBLIC_BK_BASE_FAST_API
// const ulrBaseApi = "http://127.0.0.1:8000/api"

// <<------- Cursos -------->>
export const urlGetListCourses = () => {
    return `${ulrBaseApi}/cursos/listar-cursos`
}
export const urlCreateCourses = () => {
    return `${ulrBaseApi}/cursos/crear-cursos`
}
export const urlEditCourses = () => {
    return `${ulrBaseApi}/cursos/modificar-cursos`
}

// <<------- Eventos -------->>
export const urlGetListEvents = () => {
    return `${ulrBaseApi}/eventos/listar-eventos`
}
export const urlCreateEvents = () => {
    return `${ulrBaseApi}/eventos/crear-eventos`
}
export const urlModifyEvents = () => {
    return `${ulrBaseApi}/eventos/modificar-eventos`
}
export const urlDeleteEvents = () => {
    return `${ulrBaseApi}/eventos/eliminar-eventos`
}

// <<------- Usuarios -------->>
export const urlGetListUsers = () => {
    return `${ulrBaseApi}/users/listar-usuarios`
}
export const urlCreateUsers = () => {
    return `${ulrBaseApi}/users/crear-usuarios`
}
export const urlModifyUsers = () => {
    return `${ulrBaseApi}/users/modificar-usuarios`
}
export const urlGetSpecifyUsers = () => {
    return `${ulrBaseApi}/users/consultar-usuario-especifico`
}

export const urlAsignarCursos = () => {
    return `${ulrBaseApi}/users/asignar-usuarios-cursos`
}
export const urlEliminarRelacionCursoUsuario = () => {
    return `${ulrBaseApi}/users/eliminar-relacion-usuarios-cursos`
}
// <<------- Materias -------->>
export const urlGetListMateriasCursos = () => {
    return `${ulrBaseApi}/materias/listar-materias-cursos`
}
export const urlGetListMaterias = () => {
    return `${ulrBaseApi}/materias/listar-materias`
}
export const urlCreateMaterias = () => {
    return `${ulrBaseApi}/materias/crear-materias`
}
export const urlEditMaterias = () => {
    return `${ulrBaseApi}/materias/modificar-materias`
}

export const urlAsignarMaterias = () => {
    return `${ulrBaseApi}/materias/asignar-curso-materias`
}

export const urlEliminarRelacionCursoMateria = () => {
    return `${ulrBaseApi}/materias/eliminar-relacion-curso-materias`
}
// <<------- login -------->>
export const urlLogin = () => {
    return `${ulrBaseApi}/login/verify`
}
export const urlUser = () => {
    return `${ulrBaseApi}/login/user`
}


// <<------- Notas -------->>
export const urlCreateNotas = () => {
    return `${ulrBaseApi}/notas/crear-notas`
}
export const urlGetListNotas = () => {
    return `${ulrBaseApi}/notas/listar-notas`
}
