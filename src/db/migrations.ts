require("dotenv").config();
import { Almacen } from "../models/inventario/almacen.model";
import { AlmacenesProducto } from "../models/inventario/almacenesProducto.model";
import { Cliente } from "../models/cliente.model";
import { Producto } from "../models/inventario/producto.model";
import { Usuario } from "../models/usuario.model";
import db from "./conection";
import { PreciosAddProducto } from "../models/inventario/preciosAddProducto.model";
import { Empresa } from "../models/empresa.model";
import { Venta } from "../models/comercio/venta.model";
import { SecuencialesVenta } from "../models/comercio/secuencialesVenta.model";
import { FormaPago } from "../models/comercio/formaPago.model";
import { DetalleVenta } from "../models/comercio/detalleVenta.model";

class Migrations {
  constructor() {
    this.dbConnection();
    this.migrar();
  }

  async dbConnection() {
    try {
      await db.authenticate();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async migrar() {
    try {
      await Usuario.sync();
      await Cliente.sync();
      await Almacen.sync();
      await Producto.sync();
      await AlmacenesProducto.sync();
      await PreciosAddProducto.sync();
      await Venta.sync();
      await SecuencialesVenta.sync();
      await DetalleVenta.sync();
      await FormaPago.sync();
      await Empresa.sync();
    } catch (error) {
      console.log(error);
    }
  }
}

// relaciones productos almacenes
// Producto.hasMany(Almacenes_producto, {
//   foreignKey: "producto_id",
//   sourceKey: "id",
// });

// Almacenes_producto.belongsTo(Producto, {
//   foreignKey: "producto_id",
//   targetKey: "id",
// });

const migrations = new Migrations();
