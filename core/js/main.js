const chatForm= document.getElementById('chat-form')
const chatMessages=document.querySelector('.chat-messages');
const usersList=document.getElementById('users');

const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix: true
});



const socket= io();

// Join room

socket.emit('joinRoom',{username,room});

//get room and its users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

//Message from server 
 socket.on('message', message =>{
     console.log(message);
     outputMessage(message);

     //scroll down automatic
     chatMessages.scrollTop=chatMessages.scrollHeight;

     //clear input
     document.getElementById('msg').value='';
     document.getElementById('msg').focus();

 })


//Message submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    //get message text
    const msg=e.target.elements.msg.value;

    //Emit message to the server
    socket.emit('chatMessage',msg);
});

//Output message to DOM

function outputMessage(message){
     const div=document.createElement('div');
     div.classList.add('message');// pour ajouter le style css
     div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
     <p class="text">
         ${message.text}
     </p>`
     document.querySelector('.chat-messages').appendChild(div);
}

//Add Room name to DOM

function outputRoomName(room){
    document.getElementById('room-name').innerHTML=room;
}

//Add users to DOM
function outputUsers(users){
    usersList.innerHTML='';
   for(i=0; i<users.length; i++){
    const li=document.createElement('li');
    li.innerText=users[i].username;
    usersList.appendChild(li);
   }
    
}