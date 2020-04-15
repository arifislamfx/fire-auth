import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';



firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    error: '',
    isValid: false,
    existingUser: false
  }) 

      const provider = new firebase.auth.GoogleAuthProvider();

      const  handleSignIn = () =>{
        firebase.auth().signInWithPopup(provider)
        
        .then (res => {
          const {displayName, photoURL, email} = res.user;

          const signedInUser = {
            isSignedIn: true,
            name: displayName,
            email: email,
            photo: photoURL
          }
          setUser(signedInUser);

          console.log(displayName, email, photoURL);
        })
        .catch(err => {
          console.log(err);
          console.log(err.message);
        })
      }

      const handleSignOut = () => {
        firebase.auth().signOut()
        .then (res => {
          const signOutUser = {
            isSignedIn: false,
            name: '',
            photo: '',
            email: ''
            
          }
          setUser(signOutUser);
        })
        .catch (err => {

        })
      }

      const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);

      const hasNumber = input => /\d/.test(input);

      const switchFrom = e => {
        const createdUser = {...user};
              createdUser.existingUser = e.target.checked;
              setUser(createdUser);
      }
      const handleChange =(event)=>{
        const newUserInfo = {
          ...user
        };

      
        //perform validation 

        let isValid = true;

        if (event.target.name === 'email') {
          isValid = is_valid_email(event.target.value);
        }
        if (event.target.name === "password") {
          isValid = event.target.value.length > 8 && hasNumber(event.target.value);
        }

        newUserInfo[event.target.name] = event.target.value;
        newUserInfo.isValid = isValid;
        setUser(newUserInfo);
       
      }

      const createAccount = (event) =>{
          
          if(user.isValid){

            //Create a password-based account 

            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(res => {
              console.log(res);
              const createdUser = {...user};
              createdUser.isSignedIn = true;
              createdUser.error = '';
              setUser(createdUser);
            })
            .catch(err => {
              console.log(err.message);
              const createdUser = {...user};
              createdUser.isSignedIn = false;
              createdUser.error = err.message;
              setUser(createdUser);
              
            })
          }
          event.preventDefault();
          event.target.reset();
      }

      const signInUser = event => {
        if(user.isValid){
          //Create a SignIn-based account 

          firebase.auth().signInWithEmailAndPassword(user.email, user.password)
          .then(res => {
            console.log(res);
            const createdUser = {...user};
            createdUser.isSignedIn = true;
            createdUser.error = '';
            setUser(createdUser);
          })
          .catch(err => {
            console.log(err.message);
            const createdUser = {...user};
            createdUser.isSignedIn = false;
            createdUser.error = err.message;
            setUser(createdUser);
            
          })
        }
        event.preventDefault();
        event.target.reset();
      }

  return (
    <div className="App">

      <h1>Hello Welcome to my website</h1>

      {/* //here we use short cut if else method js one line */}
      {
        user.isSignedIn ?  <button onClick={handleSignOut}>Sign out</button> :
         <button onClick={handleSignIn}>Sign in</button>

      }
     
      {
        user.isSignedIn && <div>
              <h1>Welcome, {user.name} </h1>
              <p>Your email: {user.email} </p>
              <img src={user.photo} alt=""/>
        </div> 
      }
    <h1>Login Page Bro</h1>

    <input type="checkbox" name="switchForm" onChange={switchFrom} id="switchForm" />
    <label htmlFor="switchForm"> Returning User</label>
      
    <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
      <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required />
      <br/>
      <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required />
      <br/>
      <input type="submit" value="SignIn"/>
      </form>  <br/> <br/>
    
    <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
     <input type="text" onBlur={handleChange} name="name" placeholder="Your name" required />
      <br/> <br/>
      <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required />
      <br/> <br/>
      <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required />
      <br/> <br/>
      <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color: 'red'}}> {user.error} </p>
      }
    </div>
  );
}

export default App;
