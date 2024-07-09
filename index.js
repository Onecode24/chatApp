const express=require('express');
const http=require('http');
const path=require('path'); //Pour donner les chemin vers un repertoire
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUser} = require('./utils/user')

const app=express();
const server=http.createServer(app);
const io=socketio(server); 

// donner une dossier static
app.use(express.static(path.join(__dirname, 'core')));

const botName='chat bot';

//Run when client connect
io.on('connection', socket=>{

    socket.on('joinRoom',({username,room})=>{

        const user= userJoin(socket.id, username,room);

        socket.join(user.room);

        //welcome to user
         socket.emit('message',formatMessage(botName,'Welcome to Online chat'));


        //Broadcast when user connect
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined a chat`));//Pour tous les autres utilisateur sauf celui meme


        //send user for room
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUser(user.room)
        });
    })


    //listen for chat Message
    socket.on('chatMessage',msg =>{
        const user= getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });

    //Run when clinet disconnets
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);

       if(user){
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
        
        //send user for room
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUser(user.room)
        });
       }

    });
});


const PORT=3000 || process.env.PORT;

server.listen(PORT, ()=>{console.log('Server running on port '+PORT )});