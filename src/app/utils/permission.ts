import TipoUsuarios from "./enum";

export default function RoutePermisions() {
  return (
    {
      "/": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
      "/pages/main": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
      "/pages/notas": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
      "/pages/buzon": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
      "/pages/cursos": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
      "/pages/users": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR],
        "permisions": ["*"]
      },
      "/pages/users/create-users": {
        "typeUsers": [TipoUsuarios.ADMINISTRADOR],
        "permisions": ["1"]
      },
    }
  )
}