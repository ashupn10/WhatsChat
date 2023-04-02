const formbtn=document.getElementById('submitForm');
const messageDiv=document.getElementById('Messages');


// getting last messages

async function getLastMessage(){
    const token= localStorage.getItem('token');
    const response=await axios.get(`http://localhost:3000/index/lastmessages/${localStorage.getItem('groupId')}`,{headers:{'Authentication':token}});
    showLastMessage(response.data);
}
function showLastMessage(arr){
    const messageArray=JSON.parse(localStorage.getItem(`messages${localStorage.getItem('groupId')}`));
    messageArray.unshift(arr[0]);
    messageArray.pop();
    localStorage.setItem(`messages${localStorage.getItem('groupId')}`,JSON.stringify(messageArray));
    showMessages();
}

// getting all the messages when domcontent loaded

async function getMessages(){
    const token=localStorage.getItem('token');
    const response=await axios.get(`http://localhost:3000/index/Messages/${localStorage.getItem('groupId')}`,{headers:{'Authentication':token}});

    const newResponse=JSON.stringify(response.data.message);
    localStorage.setItem(`messages${localStorage.getItem('groupId')}`,newResponse);
    showMessages();
}
function showMessages(){
    try{
        const data=JSON.parse(localStorage.getItem(`messages${localStorage.getItem('groupId')}`));
        
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
    try{
        const token=localStorage.getItem('token');
        const message=document.getElementById('message').value;
        const response=await axios.post(`http://localhost:3000/index/sendMessage/${localStorage.getItem('groupId')}`,{message:message},{headers:{'Authentication':token}});
        getLastMessage();
    }catch(err){
        alert('Something went wrong');
        console.log(err);
    }
}

// creating the group

async function createGroup(e){
    e.preventDefault();
    try{
        const groupname=document.getElementById('grpName').value;
        const token=localStorage.getItem('token');
        const response=await axios.post('http://localhost:3000/index/createGroup',{name:groupname},{headers:{'Authentication':token}});
        if(response.data.success) alert('Group Created');
        else{
            alert('Something went wrong, try again');
            return;
        }
    }catch(err){
        console.log(err);
    } 
}
// getting all the groups
async function getGroup(){
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/index/getGroup',{headers:{'Authentication':token}});
    showGroups(response.data.groups);
}
function showGroups(arr){
    const table=document.getElementById('groupTable');
    arr.forEach(Element=>{
        const tr=document.createElement('tr');
        const btn=document.createElement('button');
        btn.innerText=Element.name;
        btn.style.width='200px';
        btn.id=Element.id;
        // btn.classname='btn';
        btn.addEventListener('click',(e)=>{
            e.preventDefault();
            assignGroupTable(e.target.id);
            showUserInGroup()
            getMessages();
        });
        tr.appendChild(btn);
        table.appendChild(tr);
    })
}
function assignGroupTable(id){
    localStorage.setItem('groupId',id);
}
async function showUserInGroup(){
    const token=localStorage.getItem('token');
    const groupId=localStorage.getItem('groupId');
    const response=await axios.get(`http://localhost:3000/index/getGroupUser/${groupId}`,{headers:{'Authentication':token}});
    const table = document.getElementById('UserTable');
    let numb = table.childElementCount;
    while (numb>0){
        table.removeChild(table.lastChild);
        numb--;
    }
    response.data.users.forEach(Element=>{
        const tr=document.createElement('tr');
        const td2=document.createElement('td');
        td2.innerText=Element.email;
        tr.appendChild(td2);
        table.appendChild(tr);
    })
}
async function addUser(e){
    e.preventDefault();
    const email=document.getElementById('Useremail').value;
    const token=localStorage.getItem('token');
    const groupId=localStorage.getItem('groupId');
    const response=await axios.post(`http://localhost:3000/index/addUser/${groupId}`,{
        email:email,
    },{headers:{'Authentication':token}});
    showUserInGroup();
}

setInterval(getMessages,5000);
//////// All event Listeners

document.addEventListener('DOMContentLoaded',getGroup);
formbtn.addEventListener('click',sendMessage);
document.getElementById('createGroup').addEventListener('click',createGroup);
document.getElementById('AddUserForm').addEventListener('submit',addUser);