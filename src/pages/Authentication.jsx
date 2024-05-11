import React, { useEffect } from 'react'
import {Logo} from "../assets";
import { Footer } from '../containers';
import { AuthButtonWithProvider, MainSpinner } from '../components';
import { FaGoogle,FaGithub } from 'react-icons/fa6';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
    const {data, isLoading,isError} = useUser();


    const navigate = useNavigate();

    useEffect(()=>{
        if(!isLoading && data){
            navigate("/",{replace:true});
        }
    }, [isLoading, data]);

    if(isLoading){
        return <MainSpinner />
    }

  return (
    <div className="auth-section">
      <img src={Logo}  alt="" />


      <div className="authentication">
        <h1>Welcome to Expressume</h1>
        <p>express way to create resume</p>
        <h2>Authenticate</h2>
        <div className='btt'>
            <AuthButtonWithProvider Icon={FaGoogle} label={"Signin with Google"} provider={"GoogleAuthProvider"} />
            <AuthButtonWithProvider Icon={FaGithub} label={"Signin with GitHub"} provider={"GitHubAuthProvider"} />
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Authentication
