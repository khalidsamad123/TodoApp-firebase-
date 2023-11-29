import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { collection, addDoc, doc, getDoc, onSnapshot, deleteDoc,updateDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { db } from "./config.js"
import { auth } from "./config.js"



let getTodo = document.querySelector('#getTodo');
let newRow = document.querySelector('#newRow');
let UserId = localStorage.getItem('UserId');
let name = document.querySelector('#name');
let email = document.querySelector('#email');
let phoneNo = document.querySelector('#phoneNo');
let totalItems = 0;
let arr = []
console.log(arr)

onAuthStateChanged(auth, async (user) => {
  if (!user) {
      localStorage.removeItem("UserId")
      location.href = "./signup.html";
  }
});



onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    window.location ="./signup.html"
    // ...
  }
});

//  ============== getTodos ============ //
let getTodos = () => {
  onSnapshot(collection(db, UserId), (data) => {
    data.docChanges().forEach((todo) => {
      if (todo.type == "removed") {
        let delLi = document.getElementById(todo.doc.id);
        if (delLi) {
          delLi.remove()
        }
      } else if (todo.type === "added") {
        arr.push(todo.doc.id)
        totalItems++
        let tr = document.createElement('tr');
        let s_no = document.createElement('td');
        s_no.innerHTML = totalItems;
        let Text = document.createElement('td');
        Text.innerHTML = todo.doc.data().Todo;
        let Update = document.createElement('td');
        Update.setAttribute("id","updated")
        let date = document.createElement('td');
        date.innerHTML = todo.doc.data().date
        let deleted = document.createElement('td');
        deleted.innerHTML = `<i onclick="deleteTodo(this,'${todo.doc.id}')" class="fa-solid fa-delete-left"></i>`
        let edited = document.createElement('td');
        edited.innerHTML =  `<i onclick="edit(this, '${todo.doc.id}')" class="fa-regular fa-pen-to-square"></i>`
        tr.appendChild(s_no);
        tr.appendChild(Text);
        tr.appendChild(date)
        tr.appendChild(Update);
        Update.appendChild(deleted);
        Update.appendChild(edited);
        newRow.appendChild(tr);
        tr.setAttribute('id', `${todo.doc.id}`)
      }
    })
  })
}
getTodos()
// ============== Add Tod ============== //

document.querySelector('#add').addEventListener('click', async () => {
  try {
    if (getTodo.value == "") {
      Swal.fire({
        icon: 'error',
        title: '<h3 style="color: #00AD96 ">Oops...</h3>',
        text: 'Fill the field',
        confirmButtonColor: "#00AD96",
      })
    } else {
      const docRef = await addDoc(collection(db, UserId), {
        Todo: getTodo.value,
        date: new Date().toLocaleString()
      });
    }
    getTodo.value= ""
    // console.log("Document written with ID: ", docRef.id);  
  } catch (e) {
    console.error("Error adding document: ", e);
  }

})

//  ============== Delete todoList ============== //
let deleteed = async (e, id) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete it!',
    cancelButtonText: 'Cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire(
        'Deleted!',
        'Your list has been deleted.',
        'success'
      ).then( async() => {
        if (true) {
          await deleteDoc(doc(db, UserId, id));
  e.parentElement.parentElement.remove()
        }
      });
    }
  })
}

//  ============== Editd Todo ============== //

let edited =async (e, id) => {
  let a =prompt('Enter value')
  if(a == ""){
    Swal.fire({
      icon: 'error',
      title: '<h3 style="color: #00AD96 ">Oops...</h3>',
      text: 'Please fill the field',
      confirmButtonColor: "#00AD96",
    })
  }else{
    e.parentElement.parentElement.parentElement.children[1].innerHTML=a
    await updateDoc(doc(db, UserId, id), {
      Todo: a,
      date: new Date().toLocaleString()
    })
  }
}
window.edit = edited
window.deleteTodo = deleteed

//  ============== Get User Details ============== //

let userCurrentId = localStorage.getItem('userCurrentId')
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    //   const uid = user.uid;
    let usersRef = doc(db, "users", userCurrentId);
    const userSnap = await getDoc(usersRef);
    if (userSnap.exists()) {
      console.log(userSnap.data().Email)
      name.innerHTML = "Name :" + userSnap.data().Name;
      email.innerHTML = "Email :" + userSnap.data().Email;
      phoneNo.innerHTML = "Phone No :" + userSnap.data().Phone_NO
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    // ...
  } else {
    // User is signed out
    window.location =' ./signup.html'
    // ...
  }
});

//  ================== Delete All ================== //


document.querySelector('#adeleteed').addEventListener('click',async ()=>{
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete it!',
    cancelButtonText: 'Cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire(
        'Deleted!',
        'Your list has been deleted.',
        'success'
      ).then( async() => {
        if (true) {
          document.querySelector('#newRow').innerHTML="";
  for(let i=0; i<arr.length; i++){
    await deleteDoc(doc(db, UserId, arr[i]));
    console.log(arr[i])
  }
        }
      });
    }
  })
})

//  ================== Log out ================== //

document.querySelector('#logOut').addEventListener('click',()=>{
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Log out!',
    cancelButtonText: 'Cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your Account has been Logout',
        showConfirmButton: false,
        timer: 1500
      }).then( async() => {
        if (true) {
          auth.signOut().then(() => {
            location.href = "./login.html";
          })
        }
      });
    }
  })
})

document.querySelector('#showProfile').addEventListener('click', () => {
  document.querySelector('.popup').style.zIndex = 1;
  document.querySelector('.popup').style.opacity = 1;
})
document.querySelector('#closed').addEventListener('click', () => {
  document.querySelector('.popup').style.zIndex = -1;
  document.querySelector('.popup').style.opacity = 0;
})