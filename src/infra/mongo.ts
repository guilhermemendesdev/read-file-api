import * as dotenv from "dotenv";
import { set, connect } from "mongoose";

dotenv.config();

class Mongo {
  conectar = async () => {
    const urlMongoDb = process.env.MONGO_URL;

    // Habilita o modo de depuração
    set("debug", true);

    // Define a opção strictQuery para evitar o aviso
    set("strictQuery", false); // ou true, dependendo do que você prefere

    try {
      console.log("Tentando conectar ao MongoDB...");
      await connect(urlMongoDb);
      console.log("Conexão com o MongoDB estabelecida com sucesso!");
    } catch (error) {
      console.error("Erro ao conectar ao MongoDB:", error);
    }
  };
}

export default new Mongo();
