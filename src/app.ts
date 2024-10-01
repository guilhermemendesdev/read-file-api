import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import RotasApiTemplateBackend from "./router";

import Mongo from "./infra/mongo";

dotenv.config();

class App {
  express: express.Application;

  constructor() {
    this.inicializar();
  }

  inicializar() {
    this.express = express();
    this.express.use(cors());
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(bodyParser.json({ limit: "50mb" }));
    this.express.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.express.use(morgan(":date[iso] HTTP/:http-version :method :url :status :response-time ms"));
    this.express.use(RotasApiTemplateBackend);
    this.conectarBancoDadosMongo();
  }

  async conectarBancoDadosMongo() {
    await Mongo.conectar();
  }
}

export default new App().express;
