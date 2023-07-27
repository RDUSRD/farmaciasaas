import {Usuario} from "../pages/usuario.js";
import {Proveedor} from "../pages/proveedor.js";
import {Producto} from "../pages/producto.js";
import {LoginForm} from "../pages/login.js";
import {Inventario} from "../pages/inventario.js";

const routes = [
  {
    title: 'Usuario',
    path: "/usuario",
    component: Usuario,
  },
  {
    title: 'Proveedor',
    path: "/proveedor",
    component: Proveedor,
  },
  {
    title: 'Producto',
    path: "/producto",
    component: Producto,
  },
  {
    title: 'Inventario',
    path: "/inventario",
    component: Inventario,
  },
  {
    title: 'Inicio',
    path: "/",
    component: LoginForm,
  }

];

export default routes;