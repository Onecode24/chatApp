const express=require('express');
const http=require('http');
const path=require('path'); //Pour donner les chemin vers un repertoire
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');


const app=express();
const server=http.createServer(app);
const io=socketio(server); 

// donner une dossier static
app.use(express.static(path.join(__dirname, '_html_css')));

const botName='chat bot';

//Run when client connect
io.on('connection', socket=>{

    //welcome to user
    socket.emit('message',formatMessage(botName,'Welcome to Online chat'));


    //Broadcast when user connect
    socket.broadcast.emit('message',formatMessage(botName,'A user has joined a chat'));//Pour tous les autres utilisateur sauf celui meme

    //Run when clinet disconnets
    socket.on('disconnect',()=>{
        io.emit('message',formatMessage(botName,'A user has left the chat'));
    });

    //listen for chat Message
    socket.on('chatMessage',msg =>{
        io.emit('message',formatMessage('USER',msg));
    });
});


const PORT=3000 || process.env.PORT;

server.listen(PORT, ()=>{console.log('Server running on port '+PORT )});