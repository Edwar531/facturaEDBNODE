import express, { Application } from "express";
import cors from "cors";
import multer from "multer";
express.static(__dirname + "/assets");

// rutas
import authRoutes from "./routes/auth.route";
import clientesRoutes from "./routes/clientes.route";
import productosRoutes from "./routes/productos.route";
import preciosAdsRoutes from "./routes/preciosAdicionales.route";
import almacenesRoutes from "./routes/almacenes.route";
import ventasRoutes from "./routes/ventas.route";
import empresaRoutes from "./routes/empresa.route";

// middlewares
import validarJWT from "./middlewares/validar-jwt";
import db from "./db/conection";

const corsOptions = {
  origin: [
    "https://demo-facturacion-node.sapienciaweb.com",
    "http://localhost:4200",
  ],
  optionsSuccessStatus: 200,
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/assets/preImgs");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

class Server {
  private app: Application;
  private port;
  // private upload;

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.dbConnection();
    this.middlewares();
    this.routes();
  }

  async dbConnection() {
    try {
      await db.authenticate();
      console.log("Base de datos conectada.");
    } catch (error: any) {
      throw new Error(error);
    }
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/api/public/", express.static(__dirname + "/assets/"));
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/comercio/ventas", validarJWT, ventasRoutes);
    this.app.use(
      "/api/inventario/precios-adicionales-productos",
      validarJWT,
      preciosAdsRoutes
    );
    this.app.use("/api/inventario/productos", validarJWT, productosRoutes);
    this.app.use("/api/inventario/almacenes", validarJWT, almacenesRoutes);
    this.app.use("/api/clientes", validarJWT, clientesRoutes);
    this.app.use(
      "/api/empresa",
      validarJWT,
      upload.single("imagen"),
      empresaRoutes
    );
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log("Servidor corriendo en puerto: " + this.port)
    );
  }
}

export default Server;
