
import { Server } from 'socket.io'
import { decodeToken } from './socketio.auth.js';
import { sendMessage } from './socket.controller.js';
export let io ;
export const socketConnection = (server)=>{
io = new Server(server , {
    cors:'*'
})
io.use(async(socket , next)=>{
    const authorization = socket.handshake.auth.authorization;
    const user = decodeToken({authorization , next})
    socket.userName = user.userName ;
    socket.id = user.id;
    socket.user = user;
    next();
});
io.on('connection' , async(socket)=>{
    console.log("New client connected");
    sendMessage(socket)
    socket.on("disconnect", ()=>{console.log("Client disconnected")});
})
}


