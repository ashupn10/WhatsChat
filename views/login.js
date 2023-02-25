const loginform=document.getElementById('loginform');



////////////////////////////// Functions ///////////////////////////////////////

async function postloginform(e){
    e.preventDefault();
    const username=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const response=await axios.post('http://localhost:3000/login',{
        username:username,
        password:password
    })
    localStorage.setItem('token',response.data.token);
    alert(`you are logged in`);
    window.location.href='http://localhost:5500/views/index.html';
}

////////////////////////////// Event Listeners///////////////////////////////////

loginform.addEventListener('submit',postloginform);