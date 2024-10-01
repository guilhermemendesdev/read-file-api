import HttpStatus from "http-status";
import sharp from "sharp";
import path from "path";
import fs from "fs";

class Util {
  cadastro(result: any, message: string): any {
    return {
      result,
      message,
      status: HttpStatus.OK,
    };
  }
  duplicado(error: any): any {
    return {
      message: error,
      status: HttpStatus.CONFLICT,
    };
  }
  confirmMeasure(): any {
    return {
      sucess: true,
      status: HttpStatus.OK,
    };
  }
  notFound(message: string): any {
    return {
      message,
      status: HttpStatus.NOT_FOUND,
    };
  }

  recuperar(result: any): any {
    return {
      result,
      status: HttpStatus.OK,
    };
  }

  // Função para converter a string em Date
  formatDateString(dateStr) {
    const parts = dateStr.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // subtrai 1 para o mês
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
  }

  async uploadImage64(uri: string, customer_code: string, fileName: string, mimeType: string): Promise<any> {
    const dir = path.join(__dirname, "../../docs", customer_code); // Caminho para a pasta docs/customer_code

    // Verifica se o diretório existe, se não, cria
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Converte a string base64 em um buffer
    const imgBuffer = Buffer.from(uri, "base64");

    // Define o caminho completo do arquivo
    const filePath = path.join(dir, `${fileName}.${mimeType}`);

    // Verifica se o arquivo já existe
    if (fs.existsSync(filePath)) {
      console.log(`Arquivo já existe e será substituído: ${filePath}`);
    }

    try {
      // Processa e salva a imagem
      const data = await sharp(imgBuffer).resize(1920, null).toFile(filePath);

      console.log("Imagem salva com sucesso: ", data, filePath);
    } catch (err) {
      console.error(`Erro ao salvar a imagem: ${err}`);
    }
  }
}

export default new Util();
