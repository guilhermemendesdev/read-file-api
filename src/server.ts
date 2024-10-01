import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();

const porta = process.env.PORT || 6000;

app.listen(porta, () => console.log("API READ FILE IS RUNNING - PORT: " + porta));
