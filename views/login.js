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
    if(response.data.success){
        console.log(response.data);
        alert(response.data.message);
        window.location.href='http://localhost:3000/index';
        localStorage.setItem('token',response.data.token);
    }else{
        alert(response.data.message);
    }
}

////////////////////////////// Event Listeners///////////////////////////////////

loginform.addEventListener('submit',postloginform);