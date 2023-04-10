const formbtn = document.getElementById('submitForm');
const messageDiv = document.getElementById('Messages');


///////////////////////////// MESSAGE RELATED CODE ///////////////////////////////////////////////

// getting last messages

async function getLastMessage() {
    try {
        const groupId = localStorage.getItem('groupId');
        if (groupId) {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/index/lastmessages/${localStorage.getItem('groupId')}`, { headers: { 'Authentication': token } });
            showLastMessage(response.data);
        } else {
            alert('please select group');
        }
    } catch (err) {
        console.log(err);
    }
}
function showLastMessage(arr) {
    const messageArray = JSON.parse(localStorage.getItem(`messages${localStorage.getItem('groupId')}`));
    messageArray.unshift(arr[0]);
    messageArray.pop();
    localStorage.setItem(`messages${localStorage.getItem('groupId')}`, JSON.stringify(messageArray));
    showMessages();
}

// getting all the messages when domcontent loaded

async function getMessages() {
    try {
        const groupId = localStorage.getItem('groupId');
        if (groupId) {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/index/Messages/${groupId}}`, { headers: { 'Authentication': token } });
            if (response.data.success) {
                const newResponse = JSON.stringify(response.data.message);
                localStorage.setItem(`messages${localStorage.getItem('groupId')}`, newResponse);
                showMessages();
            } else {
                alert(response.data.message);
                timer.stop();
            }
        } else {
            console.log('please create or select User');
        }
    } catch (err) {
        console.log(err);
    }
}
function showMessages() {
    try {
        const data = JSON.parse(localStorage.getItem(`messages${localStorage.getItem('groupId')}`));

        const table = document.getElementById('message_table');
        let numb = table.childElementCount;
        while (numb > 1) {
            table.removeChild(table.lastChild);
            numb--;
        }
        data.forEach(Element => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            const td2 = document.createElement('td');
            td.innerText = Element.message;
            td2.innerText = Element.user.name;
            tr.appendChild(td2);
            tr.appendChild(td);
            table.appendChild(tr);
        })
    }
    catch (err) {
        console.log(err);
    }
}

// sending the messages

async function sendMessage(e) {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const messageform = document.getElementById('message');
        const message=messageform.value;
        const response = await axios.post(`http://localhost:3000/index/sendMessage/${localStorage.getItem('groupId')}`, { message: message }, { headers: { 'Authentication': token } });
        messageform.value='';
        getLastMessage();
    } catch (err) {
        alert('Something went wrong');
        console.log(err);
    }
}

//////////////////////////////////////// MESSAGE END////////////////////////////////////

///////////////////////////////////////////////// GROUP RELATED CODE //////////////////////////////////

// creating the group

async function createGroup(e) {
    e.preventDefault();
    try {
        const groupname = document.getElementById('grpName').value;
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/index/createGroup', { name: groupname }, { headers: { 'Authentication': token } });
        if (response.data.success) {
            await getGroup();
            alert('Group Created');
        }
        else {
            alert('Something went wrong, try again');
            return;
        }
    } catch (err) {
        console.log(err);
    }
}

// getting all the groups
async function getGroup() {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/index/getGroup', { headers: { 'Authentication': token } });
    showGroups(response.data.groups);
    console.log(response.data);
}
function showGroups(arr) {
    const table = document.getElementById('groupTable');
    let numb = table.childElementCount;
    while (numb > 0) {
        table.removeChild(table.lastChild);
        numb--;
    }
    arr.forEach(Element => {
        const tr = document.createElement('tr');
        const btn = document.createElement('button');
        btn.innerText = Element.name;
        btn.style.width = '200px';
        btn.id = Element.id;
        // btn.classname='btn';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('groupId', e.target.id);
            showUserInGroup();
            getMessages();
        });
        tr.appendChild(btn);
        let deleteAdmin = document.createElement('button');
        deleteAdmin.innerText = 'X';
        deleteAdmin.style.color = 'red';
        deleteAdmin.id = Element.id;
        deleteAdmin.addEventListener('click', deleteGroup);
        insertAfter(deleteAdmin, btn);
        table.appendChild(tr);
    })
}
async function deleteGroup(e) {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`http://localhost:3000/index/deleteGroup/${e.target.id}`, { headers: { 'Authentication': token } });

    if (response.data.success) {
        e.target.parentNode.remove();
        e.target.remove();
    }
    alert(response.data.message);
}

async function showUserInGroup() {
    const token = localStorage.getItem('token');
    const groupId = localStorage.getItem('groupId');
    const form = document.getElementById('AddUserForm')
    const response = await axios.get(`http://localhost:3000/index/getGroupUser/${groupId}`, { headers: { 'Authentication': token } });
    console.log(response.data);
    const table = document.getElementById('UserTable');
    let numb = table.childElementCount;
    while (numb > 0) {
        table.removeChild(table.lastChild);
        numb--;
    }
    response.data.users.forEach(Element => {
        const tr = document.createElement('tr');
        const td2 = document.createElement('td');
        td2.innerText = Element.name;
        tr.appendChild(td2);
        if (Element.usergroups[0].isAdmin) {
            let adm = document.createElement('button');
            adm.style.backgroundColor = 'black';
            adm.style.color = 'white';
            adm.innerText = 'A';
            tr.appendChild(adm);
            removeButton(Element.id,adm);
        }else{
            let admbtn = document.createElement('button');
            admbtn.innerText = 'Create Admin';
            admbtn.id = Element.id;
            admbtn.addEventListener('click', (e) => {
                createAdmin(e);
                e.target.remove();
            });
            tr.appendChild(admbtn);
            removeButton(Element.id,admbtn);
        }
        table.appendChild(tr);
    })
}
function removeButton(id,existingNode) {
    let deleteAdmin = document.createElement('button');
    deleteAdmin.innerText = 'X';
    deleteAdmin.style.color = 'red';
    deleteAdmin.id = id;
    deleteAdmin.addEventListener('click', removeAdmin);
    insertAfter(deleteAdmin, existingNode);
}


/////////////////////////////////////// END OF GROUP//////////////////////////////////////////////

///////////////////////////////////////// ADMIN CODE /////////////////////////////////////////////

async function createAdmin(e) {
    try {
        let adm = document.createElement('button');
        adm.style.backgroundColor = 'black';
        adm.style.color = 'white';
        adm.innerText = 'A';
        insertAfter(adm, e.target);
        const id = e.target.id;
        const token = localStorage.getItem('token');
        const groupId = localStorage.getItem('groupId');
        const response = await axios.post(`http://localhost:3000/index/createAdmin/${groupId}`, { userId: id }, { headers: { 'Authentication': token } });
        alert(response.data.message);

    } catch (err) {
        console.log(err);
    }
}
async function removeAdmin(e) {
    const token = localStorage.getItem('token');
    const groupId = localStorage.getItem('groupId');
    const userId = e.target.id;
    console.log(userId);
    const response = await axios.delete(`http://localhost:3000/index/removeUser/${groupId}/${userId}`, { headers: { 'Authentication': token } });
    e.target.parentNode.remove();
    e.target.remove();
    alert(response.data);
}
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
async function addUser(e) {
    e.preventDefault();
    const email = document.getElementById('Useremail').value;
    const token = localStorage.getItem('token');
    const groupId = localStorage.getItem('groupId');
    const response = await axios.post(`http://localhost:3000/index/addUser/${groupId}`, {
        email: email,
    }, { headers: { 'Authentication': token } });
    showUserInGroup();
}

////////////////////////////////////admin ends//////////////////////////////////////////


/////////////////////////////////  Timer Funtion     ///////////////////////////////////////////////////////////////
function Timer(fn, t) {
    var timerObj = setInterval(fn, t);

    this.stop = function () {
        if (timerObj) {
            clearInterval(timerObj);
            timerObj = null;
        }
        return this;
    }

    // start timer using current settings (if it's not already running)
    this.start = function () {
        if (!timerObj) {
            this.stop();
            timerObj = setInterval(fn, t);
        }
        return this;
    }

    // start with new or original interval, stop current interval
    this.reset = function (newT = t) {
        t = newT;
        return this.stop().start();
    }
}
var timer = new Timer(function () {
    getMessages();
}, 5000);
timer.start();


////////////////////////////////////////////timer Ends///////////////////////////////////////////////

///////////////////////////////////////////////// Sockets ////////////////////////////////////




//////// All event Listeners

document.addEventListener('DOMContentLoaded', getGroup);
formbtn.addEventListener('click', sendMessage);
document.getElementById('createGroup').addEventListener('click', createGroup);
document.getElementById('AddUserForm').addEventListener('submit', addUser);