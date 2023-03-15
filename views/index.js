const formbtn=document.getElementById('sendMessage');

async function getMessages(){

}

async function sendMessage(e){
    e.preventDefault();
    const token=localStorage.getItem('token');
    const message=document.getElementById('message').value;
    const response=await axios.post('http://localhost:3000/index/sendMessage',{message:message},{headers:{'Authentication':token}});
    getMessages();
}

formbtn.addEventListener('submit',sendMessage);