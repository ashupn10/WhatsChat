const formbtn=document.getElementById('sendMessage');
const messageDiv=document.getElementById('Messages');


// getting last messages

async function getLastMessage(){
    const token= localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/index/lastmessages',{headers:{'Authentication':token}});
    showLastMessage(response.data);
}
function showLastMessage(arr){
    const messageArray=JSON.parse(localStorage.getItem('messages'));
    messageArray.push(arr);
    messageArray.shift();
    localStorage.setItem('messages',JSON.stringify(messageArray));
    showMessages();
}

// getting all the messages when domcontent loaded

async function getMessages(e){
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/index/Messages',{headers:{'Authentication':token}});
    const newResponse=JSON.stringify(response.data.message);
    localStorage.setItem('messages',newResponse);
    showMessages();
}
function showMessages(){
    try{
        const data=JSON.parse(localStorage.getItem('messages'));
        
        const table=document.getElementById('message_table');
        let numb = table.childElementCount;
        while (numb>1){
            table.removeChild(table.lastChild);
            numb--;
        }
        data.forEach(Element=>{
            const tr=document.createElement('tr');
            const td=document.createElement('td');
            const td2=document.createElement('td');
            td.innerText=Element.message;
            td2.innerText=Element.email;
            tr.appendChild(td2);
            tr.appendChild(td);
            table.appendChild(tr);
        })
    }
    catch(err){
        console.log(err);
    }
}

// sending the messages

async function sendMessage(e){
    e.preventDefault();
    const token=localStorage.getItem('token');
    const message=document.getElementById('message').value;
    const response=await axios.post('http://localhost:3000/index/sendMessage',{message:message},{headers:{'Authentication':token}});
    getLastMessage();
}
setInterval(showMessages,5000);

//////// All event Listeners

document.addEventListener('DOMContentLoaded',getMessages);
formbtn.addEventListener('submit',sendMessage);