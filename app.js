const database = firebase.database()
var uid, email

const joinin = (event, s) => {
    
    if(s == 0){
        event.preventDefault();
        let email = document.getElementById("email")
        let password = document.getElementById("password")

        if(email.value == "" || password.value == ""){
            document.getElementById("f-error").innerHTML = "Enter email or password"  
        }
        else{
            firebase.auth().signInWithEmailAndPassword(email.value, password.value)
                    .catch(function(error) {
                        if(error.message.slice(0, 16) == 'There is no user'){

                            firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
                                .catch(function(upError) {
                                    error.message.length > 0 ? document.getElementById("f-error").innerHTML = upError.message : window.location.href = "home.html"
                                })
                                
                                .then((data)=>{
                                    uid = data.user.uid
                                    email = data.user.email

                                    database.ref(`chatApp/users/${data.user.uid}`).set({
                                        userId: uid,
                                        email: email,
                                    })
                                    localStorage.setItem('data', JSON.stringify({uid: uid, email: email}))

                                    location.href = "home.html"
        
                                })
                        }
                        else if (error.message.length > 0) {
                            document.getElementById("f-error").innerHTML = error.message   
                        }

                })
                .then((data) => {
                        uid = data.user.uid
                        email = data.user.email

                        let p = new Promise( (resolve, reject) => {
                            database.ref(`chatApp/users/${uid}`).on('value', data => {
                                resolve(data.val())
                            })
                        })

                        p
                        .then( data => { 
                            localStorage.setItem('data', JSON.stringify({uid: uid, email: email}))
                            location.href = "home.html"
                        })
                });
        }
        
    }
    else 
    {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;

            window.uid = result.user.uid;
            window.email = result.user.email;

            let p = new Promise( (resolve, reject) => {
                database.ref(`chatApp/users/${uid}`).on('value', data => {
                    
                    if (data.val() == null){

                        database.ref(`chatApp/users/${uid}`).set({
                            userId: uid,
                            email: email,
                        })

                    }

                    else {
                        resolve({uid: uid, email: email})
                    }
                })
            })

            p
            .then( data => { 
                // console.log(data)
                window.contact = data.contact
                localStorage.setItem('data', JSON.stringify({uid: uid, email: email}))
                location.href = 'home.html'
            })


        }).catch(function(error) {
            document.getElementById("f-error").innerHTML = upError.messageloadChatapp()
          });
    }
}

const logout = () => {
    localStorage.clear()
    location.href = 'index.html'
}

const loadChatapp = () => {
    let dataLocal = JSON.parse(localStorage.getItem('data'))

    let list = document.getElementById('h-contact')

    dataLocal == null ? location.href = 'index.html' : dataLocal

    let p = new Promise( (resolve, reject) => {
        database.ref(`chatApp/users/`).on('value', data => {
            resolve(data.val())
        })
    })

    p.then( data => {

        for (var item in data){
            
            if (data[item].userId != dataLocal.uid){

                let spn = document.createElement('span')
                let h = document.createElement('h6')
                let dv = document.createElement('div')

                // console.log(data[item])
                dv.setAttribute('class', 'contact-list')
                dv.setAttribute('id', `${data[item].userId}`)
                spn.innerHTML = data[item].email[0].toUpperCase()
                h.innerHTML = data[item].email.split('@')[0]
                dv.appendChild(spn)
                dv.appendChild(h)
                list.appendChild(dv)
            }
        }
    })
}