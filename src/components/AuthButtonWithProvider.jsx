
import React from 'react'
import { FaChevronRight } from 'react-icons/fa6'
import {GoogleAuthProvider,GithubAuthProvider, signInWithRedirect} from "firebase/auth"
import { auth } from '../config/firebase.config';
const AuthButtonWithProvider = ({Icon, label,provider}) => {
    const googleAuthProvider = new GoogleAuthProvider();
    const gitAuthProvider = new GithubAuthProvider();
    const handleClick = async () =>{
        switch(provider){
            case "GoogleAuthProvider" :
                await signInWithRedirect(auth, googleAuthProvider).then((result)=>{
                    console.log(result)
                }).catch(err =>{
                    console.log(`Error :${err.Message}`);
                });
                
                break;

                case "GitHubAuthProvider" :
                    await signInWithRedirect(auth, gitAuthProvider).then((result)=>{
                        console.log(result)
                    }).catch(err =>{
                        console.log(`Error :${err.Message}`);
                    });
                    break;

                    default :
                    console.log("Inside the Google Auth");
                    break;
        }
    };
  return (
    <div onClick={handleClick} className='authprovider'>
      <Icon />
      <p>{label}</p>
      <FaChevronRight />
    </div>
  )
}

export default AuthButtonWithProvider
