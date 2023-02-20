////////////////////////////////////////// Requires///////////////////////////////////

const signUpForm=document.getElementById('signForm');

/////////////////////////////////////////// Functions//////////////////////////////////

async function postFormData(){
    try{
        const name=document.getElementById('name').value;
        const email=document.getElementById('email').value;
        const mobile=document.getElementById('mobile').value;
        const password=document.getElementById('password').value;
        const response=await axios.post('http://localhost:3000/signUp',{
            name:name,
            mobile:mobile,
            email:email,
            password:password
        })
        alert(response.data.message);
    }catch(err){
        console.log(err);
    }
}



///////////////////////////////////////// EventListeners////////////////////////////////

signUpForm.addEventListener('submit',postFormData)