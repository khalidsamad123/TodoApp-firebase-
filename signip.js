import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"; 

import{auth} from "./config.js"
import{db} from "./config.js"


let btn = document.querySelector('.signup')

btn.addEventListener('click',()=>{
    let sname = document.querySelector('#sname');
    let semail = document.querySelector('#semail');
    let spassword = document.querySelector('#spassword');
    let sphoneNo = document.querySelector('#sphoneNo')
    let email = semail.value;
    let password = spassword.value;
    createUserWithEmailAndPassword(auth, email, password)
  .then( async(userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user)
    try {
        const docRef = await addDoc(collection(db, "users"), {
            Name : sname.value,
            Email: email,
            Password: password,
            Phone_NO : sphoneNo.value,
          uid: user.uid
        });
        console.log("Document written with ID: ", docRef.id);
        localStorage.setItem('userCurrentId',docRef.id)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your Signup has been Succeessfully',
          showConfirmButton: false,
          timer: 1500
        }).then(() =>{
          if(true){
            window.location ='login.html'
          }
        })
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = errorCode.slice(5).toUpperCase();
    const errMessage = errorMessage.replace(/-/g, " ");
    Swal.fire({
      icon: 'error',
      title: '<h3 style="color: #00AD96 ">Oops...</h3>',
      text: errMessage,
      confirmButtonColor: "#00AD96",
      iconColor: '#00AD96',
    })
    // alert(errMessage)
  });
    // console.log('hi')
})