export default function RoutePermisions() {
  return (
    {
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
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
      "/pages/users/create-users": {
        "typeUsers": ["*"],
        "permisions": ["*"]
      },
    }
  )
}