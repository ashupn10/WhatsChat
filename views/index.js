const formbtn=document.getElementById('sendMessage');
const messageDiv=document.getElementById('Messages');


async function getMessages(e){
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/index/Messages',{headers:{'Authentication':token}});
    showMessages(response.data.message);
}
function showMessages(arr){
    console.log(arr);
    const table=document.getElementById('message_table');
    arr.forEach(Element=>{
        const tr=document.createElement('tr');
        const td=document.createElement('td');
        const td2=document.createElement('td');
        td.innerText=Element.message;
        td2.innerText=Element.email;
        tr.appendChild(td);
        tr.appendChild(td2);
        table.appendChild(tr);
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