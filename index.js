import express from "express"
import { bootstrap } from "./src/app.controller.js";
import { socketConnection } from "./src/socketio/socketio.js";


const app = express();
const port = process.env.PORT;

bootstrap(app , express);



const server = app.listen(port , ()=>console.log(`server is running successfully`));

socketConnection(server)