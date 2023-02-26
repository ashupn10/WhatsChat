const formbtn=document.getElementById('sendMessage');


async function sendMessage(e){
    const token=localStorage.getItem('token');
    const message=document.getElementById('message').value;
    const response=await axios.post('http://localhost:3000/index/sendMessage',{message:message},{headers:{'Authentication':token}});
}


formbtn.addEventListener('submit',sendMessage);