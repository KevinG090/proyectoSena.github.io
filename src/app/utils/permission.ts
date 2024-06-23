import TipoUsuarios from "./enum";

export default function RoutePermisions() {
  return (
    {
      "/": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
      // <<-------------- Eventos -------------->>
      "/pages/main": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
      "/pages/main/create-events": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["*"]
      },
      
      // <<-------------- Notas -------------->>
      "/pages/notas": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
      "/pages/notas?": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["*"]
      },
      
      // <<-------------- Buzon -------------->>
      "/pages/buzon": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },

      // <<-------------- Cursos -------------->>
      "/pages/cursos": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["*"]
      },
      "/pages/cursos/asignar-materias": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["*"]
      },
      "/pages/cursos/create-cursos": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["*"]
      },
      "/pages/cursos/search-students": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["*"]
      },
      // <<-------------- Usuarios -------------->>
      "/pages/users": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["*"]
      },
      "/pages/users/create-users": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["1"]
      },
      "/pages/users/asignar-cursos": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["1"]
      },
      "/pages/users/gestion": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["1"]
      },
      "/pages/users?": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["1"]
      },
      
      // <<-------------- Materias -------------->>
      "/pages/materias": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
      "/pages/materias/create-materias": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR, TipoUsuarios.PROFESOR],
        "permisions": ["1"]
      },
    }
  )
}