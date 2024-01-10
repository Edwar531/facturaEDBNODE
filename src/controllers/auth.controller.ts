import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import randomize from "randomatic";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuario.model";
import { PreciosAddProducto } from "../models/inventario/preciosAddProducto.model";
import { Cliente } from "../models/cliente.model";
import { Empresa } from "../models/empresa.model";
import { Producto } from "../models/inventario/producto.model";
import { AlmacenesProducto } from "../models/inventario/almacenesProducto.model";
import { Almacen } from "../models/inventario/almacen.model";

export const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  let usuario = await Usuario.findOne({ where: { name: name } });

  if (!usuario) {
    return res.status(401).json({
      msg: "Las credenciales son incorrectas.",
    });
  }

  const validarPassword = bcryptjs.compareSync(
    password.toString(),
    usuario?.password
  );

  if (!validarPassword) {
    return res.status(401).json({
      msg: "Las credenciales son incorrectas.",
    });
  }

  const accessToken = await generarJWT(usuario.id.toString());

  res.json({
    msg: "Inicio de sesión éxitoso",
    accessToken,
    token_type: "Bearer",
    user: usuario,
  });
};

const generarJWT = (id: string) => {
  let payload = { id };
  return new Promise((resolve, reject) => {
    let privatekey: any = process.env.PRIVATEKEYJWT;
    jwt.sign(payload, privatekey, { expiresIn: "4h" }, (err, token) => {
      if (err) {
        reject("Fallo el proceso de creación del token de autenticación");
      }
      resolve(token);
    });
  });
};

export const crearUsuarioPrueba = async (req: Request, res: Response) => {
  let { user } = req.body;

  let usuario = await Usuario.findOne({ where: { name: user } });
  let errors: any = {};
  if (usuario) {
    errors.user = "Ya existe un usuario con el nombre: " + user;
  }

  if (Object.keys(errors).length != 0) {
    return res.status(422).json({
      errors,
    });
  }

  var salt = bcryptjs.genSaltSync(10);
  let passwordNob = randomize("Aa0", 10);
  let password = bcryptjs.hashSync(passwordNob, salt);
  const email = user + "@test.com";

  user = await Usuario.create({
    name: user,
    email: email,
    password,
  });

  const almacen1: any = await Almacen.create({
    user_id: user.id,
    nombre: "Almacen 1",
  });
  const almacen2: any = await Almacen.create({
    user_id: user.id,
    nombre: "Almacen 2",
  });

  await PreciosAddProducto.create({
    user_id: user.id,
    descripcion: "20 %",
    porcentaje_ganancia: 20,
  });

  await PreciosAddProducto.create({
    user_id: user.id,
    descripcion: "25 %",
    porcentaje_ganancia: 25,
  });

  await PreciosAddProducto.create({
    user_id: user.id,
    descripcion: "30 %",
    porcentaje_ganancia: 30,
  });

  let p: any = await Producto.create({
    user_id: user.id,
    descripcion: "Arroz La torre 1kg",
    codigo: "1234567",
    precio_compra: 0.85,
    porcentaje_ganancia: 15,
    ganancia: 0.1275,
    precio_venta_sin_iva: 0.9775,
    iva: 12,
    grabaiva: 0,
    precio_venta: 0.9775,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Mayonesa maxi",
    codigo: "7654321",
    precio_compra: 1.4,
    porcentaje_ganancia: 15,
    ganancia: 0.21,
    precio_venta_sin_iva: 1.61,
    iva: 12,
    grabaiva: 0,
    precio_venta: 1.61,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Salsa de tomate MK",
    codigo: "7654322",
    precio_compra: 1.3,
    porcentaje_ganancia: 15,
    ganancia: 0.195,
    precio_venta_sin_iva: 1.495,
    iva: 12,
    grabaiva: 0,
    precio_venta: 1.495,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Azucar refinada el sol",
    codigo: "7654341",
    precio_compra: 0.95,
    porcentaje_ganancia: 15,
    ganancia: 0.1495,
    precio_venta_sin_iva: 1.0925,
    iva: 12,
    grabaiva: 0,
    precio_venta: 1.0925,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Arroz El Conde 5 kg",
    codigo: "7654521",
    precio_compra: 4.5,
    porcentaje_ganancia: 15,
    ganancia: 0.675,
    precio_venta_sin_iva: 5.175,
    iva: 12,
    grabaiva: 1,
    precio_venta: 5.796,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Arroz Angeles 5 kg",
    codigo: "7658321",
    precio_compra: 4.7,
    porcentaje_ganancia: 15,
    ganancia: 0.705,
    precio_venta_sin_iva: 5.405,
    iva: 12,
    grabaiva: 1,
    precio_venta: 6.0536,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "shampoo 1 lt Cabello Sedoso",
    codigo: "7694321",
    precio_compra: 6.13,
    porcentaje_ganancia: 15,
    ganancia: 0.9195,
    precio_venta_sin_iva: 7.0495,
    iva: 12,
    grabaiva: 1,
    precio_venta: 7.89544,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Cloro Tornado 1 lt",
    codigo: "7610321",
    precio_compra: 1.1,
    porcentaje_ganancia: 15,
    ganancia: 0.165,
    precio_venta_sin_iva: 1.265,
    iva: 12,
    grabaiva: 1,
    precio_venta: 1.4168,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Aceite Girasol 1 lt",
    codigo: "1154321",
    precio_compra: 6.13,
    porcentaje_ganancia: 15,
    ganancia: 0.9195,
    precio_venta_sin_iva: 7.0495,
    iva: 12,
    grabaiva: 1,
    precio_venta: 7.89544,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Cloro Ciclo max 3 en 1 de 1 lt",
    codigo: "7124321",
    precio_compra: 1.5,
    porcentaje_ganancia: 15,
    ganancia: 0.225,
    precio_venta_sin_iva: 1.725,
    iva: 12,
    grabaiva: 1,
    precio_venta: 1.932,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Leche La Ternera 1 lt",
    codigo: "7651321",
    precio_compra: 1.5,
    porcentaje_ganancia: 15,
    ganancia: 0.225,
    precio_venta_sin_iva: 1.725,
    iva: 12,
    grabaiva: 1,
    precio_venta: 1.932,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Jugo de Naranaja El Amanecer 1 lt",
    codigo: "7654141",
    precio_compra: 1.5,
    porcentaje_ganancia: 15,
    ganancia: 0.225,
    precio_venta_sin_iva: 1.725,
    iva: 12,
    grabaiva: 1,
    precio_venta: 1.932,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Jugo de Manzana El Frutal 1 lt",
    codigo: "7654315",
    precio_compra: 1.1,
    porcentaje_ganancia: 15,
    ganancia: 0.165,
    precio_venta_sin_iva: 1.265,
    iva: 12,
    grabaiva: 1,
    precio_venta: 1.4168,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Leche Mi vaca 1 lt",
    codigo: "7654161",
    precio_compra: 1.1,
    porcentaje_ganancia: 15,
    ganancia: 0.165,
    precio_venta_sin_iva: 1.265,
    iva: 12,
    grabaiva: 1,
    precio_venta: 1.4168,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Aceite el dorado 1 lt",
    codigo: "7617321",
    precio_compra: 6.13,
    porcentaje_ganancia: 15,
    ganancia: 0.9195,
    precio_venta_sin_iva: 7.0495,
    iva: 12,
    grabaiva: 1,
    precio_venta: 7.89544,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen2.id,
    cantidad: 7,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Arroz Dora 1 kg",
    codigo: "1854321",
    precio_compra: 1.1,
    porcentaje_ganancia: 15,
    ganancia: 0.165,
    precio_venta_sin_iva: 1.265,
    iva: 12,
    grabaiva: 1,
    precio_venta: 1.4168,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen2.id,
    cantidad: 7,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Sal EL manantial 1 kg",
    codigo: "7619321",
    precio_compra: 0.5,
    porcentaje_ganancia: 15,
    ganancia: 0.075,
    precio_venta_sin_iva: 0.575,
    iva: 12,
    grabaiva: 1,
    precio_venta: 0.644,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen2.id,
    cantidad: 7,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Salsa de tomate El placer",
    codigo: "7620321",
    precio_compra: 1.1,
    porcentaje_ganancia: 15,
    ganancia: 0.165,
    precio_venta_sin_iva: 1.265,
    iva: 12,
    grabaiva: 0,
    precio_venta: 1.265,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Salsa picante Aji",
    codigo: "7652121",
    precio_compra: 0.5,
    porcentaje_ganancia: 15,
    ganancia: 0.075,
    precio_venta_sin_iva: 0.575,
    iva: 12,
    grabaiva: 1,
    precio_venta: 0.644,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen2.id,
    cantidad: 7,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Shampoo Anti caspa Savi",
    codigo: "7622321",
    precio_compra: 6.13,
    porcentaje_ganancia: 15,
    ganancia: 0.9195,
    precio_venta_sin_iva: 7.0495,
    iva: 12,
    grabaiva: 1,
    precio_venta: 7.89544,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Margarina 600 gr",
    codigo: "7234321",
    precio_compra: 1.1,
    porcentaje_ganancia: 15,
    ganancia: 0.165,
    precio_venta_sin_iva: 1.265,
    iva: 12,
    grabaiva: 0,
    precio_venta: 1.265,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen2.id,
    cantidad: 7,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Mantequilla Primavera 600 gr",
    codigo: "2454321",
    precio_compra: 1.1,
    porcentaje_ganancia: 15,
    ganancia: 0.165,
    precio_venta_sin_iva: 1.265,
    iva: 12,
    grabaiva: 0,
    precio_venta: 1.265,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen2.id,
    cantidad: 7,
  });

  p = await Producto.create({
    user_id: user.id,
    descripcion: "Mantequilla EL Sol 600 gr",
    codigo: "7625321",
    precio_compra: 1.1,
    porcentaje_ganancia: 15,
    ganancia: 0.165,
    precio_venta_sin_iva: 1.265,
    iva: 12,
    grabaiva: 0,
    precio_venta: 1.265,
    deshabilitado: 0,
  });

  await AlmacenesProducto.create({
    producto_id: p.id,
    almacen_id: almacen1.id,
    cantidad: 10,
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "0991234792",
    tipo_ident: "CÉDULA",
    razon_social: "Liliana Sanchez",
    nombre_comercial: "Liliana Sanchez",
    email: "Liliana@gmail.com",
    telefono: "(593) (2) 2285820",
    ciudad: "Quito",
    direccion: "GARCIA MORENO Y ROCAFUERTE ESQ., CC.LA MANZANA LOC.9",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "0432135792001",
    tipo_ident: "RUC",
    razon_social: "Ricardo Benitez",
    nombre_comercial: "Ricardo Benitez",
    email: "Ricardo@gmail.com",
    telefono: "04-2337986",
    ciudad: "Ibarra",
    direccion: "Río Tuhuando 153 Y Yasuní",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "1234235792001",
    tipo_ident: "RUC",
    razon_social: "Juana Gutierrez",
    nombre_comercial: "Juana Gutierrez",
    email: "Juana@gmail.com",
    telefono: " 042454437",
    ciudad: "Guayas",
    direccion: "Av J Tanca Marengo Km 4.5 CC Sai Baba",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "2233235792001",
    tipo_ident: "RUC",
    razon_social: "Marta Ruiz",
    nombre_comercial: "Marta Ruiz",
    email: "Marta@gmail.com",
    telefono: "(593) (4) 2306198",
    ciudad: "Guayas",
    direccion: "Av J Tanca Marengo Km 4.5 CC Sai Baba",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "3344235792",
    tipo_ident: "CÉDULA",
    razon_social: "Cesar Romero",
    nombre_comercial: "Cesar Romero",
    email: "Cesar@gmail.com",
    telefono: "",
    ciudad: "",
    direccion: "",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "0993232245001",
    tipo_ident: "RUC",
    razon_social: "Ana Rodriguez",
    nombre_comercial: "Ana Rodriguez",
    email: "Ana@gmail.com",
    telefono: "(593 2) 3966921",
    ciudad: "Guayas",
    direccion: "Rumichaca 832, Guayaquil",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "0911235792001",
    tipo_ident: "RUC",
    razon_social: "Julio Medina",
    nombre_comercial: "Julio Medina",
    email: "Julio@gmail.com",
    telefono: "02-2374347",
    ciudad: "Latacunga",
    direccion: "Marco Aurelio Subia Frente Al Terminal Terrestre",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "0922235792001",
    tipo_ident: "RUC",
    razon_social: "Ricardo Lopez",
    nombre_comercial: "Ricardo Lopez",
    email: "RicardoLopez@gmail.com",
    telefono: "(593) (4) 2569348",
    ciudad: "Guayas",
    direccion: "Cdla Urbanor Mz 125 Sl 6 entrando por De Maruri",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "0933235792",
    tipo_ident: "CÉDULA",
    razon_social: "Miguel Diaz",
    nombre_comercial: "Miguel Diaz",
    email: "Miguel@gmail.com",
    telefono: "(593) (4) 2449348",
    ciudad: "Guayas",
    direccion: "Rumichaca 2614 y Brasil",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "0443235792001",
    tipo_ident: "RUC",
    razon_social: "Víctor Romero",
    nombre_comercial: "Víctor Romero",
    email: "Victor@gmail.com",
    telefono: "(593) (4) 4449348",
    ciudad: "Guayas",
    direccion: "Av Fco de Orellana Cdla Las Garzas Mz 11 Villa 12 Dp 2",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "0444435792001",
    tipo_ident: "RUC",
    razon_social: "Alicia Lopez",
    nombre_comercial: "Alicia Lopez",
    email: "Alicia@gmail.com",
    telefono: "",
    ciudad: "Pichincha",
    direccion: "CALLE H N37-234 Y VILLALENGUA",
  });

  await Cliente.create({
    user_id: user.id,
    identificacion: "0101035792",
    tipo_ident: "CÉDULA",
    razon_social: "Silvia Fernandez",
    nombre_comercial: "Silvia Fernandez",
    email: "Silvia@gmail.com",
    telefono: "(593) (2) 3339980",
    ciudad: "Pichincha",
    direccion: "AV.10 DE AGOSTO N37-288 Y VILLALENGUA",
  });

  await Empresa.create({
    user_id: user.id,
    ruc: "1101035792001",
    razon_social: user.name,
    nombre_comercial: user.name,
    direccion: "AV.10 DE AGOSTO N37-288 Y VILLALENGUA",
    telefono: "593-233.39.98",
    email: user.name + "@gmail.com",
    path_img: "",
  });


  res.json({ user: user.name, password: passwordNob });
};
