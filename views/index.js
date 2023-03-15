const formbtn=document.getElementById('sendMessage');
const messageDiv=document.getElementById('Messages');


async function getMessages(e){
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/index/Messages',{headers:{'Authentication':token}});
    showMessages(response.data);
}
function showMessages(arr){
    arr.forEach(Element=>{
        const item=document.createElement('li');
    })
}

async function sendMessage(e){
    e.preventDefault();
    const token=localStorage.getItem('token');
    const message=document.getElementById('message').value;
    const response=await axios.post('http://localhost:3000/index/sendMessage',{message:message},{headers:{'Authentication':token}});
    getMessages();
}

document.addEventListener('DOMContentLoaded',getMessages);
formbtn.addEventListener('submit',sendMessage);