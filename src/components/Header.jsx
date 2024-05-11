import React, { useState } from 'react'
import useUser from "../hooks/useUser";
import { Link } from 'react-router-dom';
import { Logo } from '../assets';
import { AnimatePresence,motion } from 'framer-motion';
import { PuffLoader } from 'react-spinners';
import {HiLogout} from "react-icons/hi";
import { FadeInOutWithOpacity, slideUpDownMenu } from '../animations';
import { auth } from '../config/firebase.config';
import { useQueryClient } from 'react-query';
import { adminIds } from '../utilis/helpers';
const Header = () => {
    const {data, isLoading, isError} = useUser();
    const [isMenu,setIsMenu] = useState(false);

    const queryClient = useQueryClient();

    const signOutUser = async() =>{
        await auth.signOut().then(()=>{
            queryClient.setQueryData("user",null);
        });
    };
  return (
    
    <header>
        <div className='he'>
        <Link to={"/"}>
            <img src={Logo} className='imghe' alt='' />
        </Link>
        <div className='headin'>
            <input type='text' placeholder='Search here...'></input>
        </div>
        <AnimatePresence>
            {isLoading ? (<PuffLoader color="#498FCD" size={40} />
            ) : (
                <React.Fragment>
                    {data ? ( <motion.div {...FadeInOutWithOpacity } className='he5' onClick={() => setIsMenu(!isMenu)}>
                        {data?.photoURL? (
                            <div className='he1'>
                                <img src={data?.photoURL} className='he4'
                                referrerPolicy='no-referrer'
                                alt='' />
                            </div>
                        ) :(
                            <div className='he2'>
                                <p className='he3'>{data?.email[0]}</p>
                            </div>
                        )}
                        <AnimatePresence>
                            {isMenu && <div className='he6' onMouseLeave={() => setIsMenu(false)}>
                            <motion.div  {...slideUpDownMenu}>
                            {data?.photoURL? (
                            <div className='he7'>
                                <img src={data?.photoURL} className='he10'
                                referrerPolicy='no-referrer'
                                alt='' />
                            </div>
                        ) :(
                            <div className='he8'>
                                <p className='he11'>{data?.email[0]}</p>
                            </div>
                        )}
                        {data?.displayName && (
                            <p className='he9'>{data?.displayName}</p>
                        )}
                        {/* menus */}
                        <div className='he12'>
                            <Link to={"/profile"}>My Account</Link><br></br>
                            {adminIds.includes(data?.uid) && (<Link to={"/template/create"}>Add New Template</Link>)}
                            <div className='he14' onClick={signOutUser}><br></br>
                                <p className='he13'>Sign Out</p>
                                <HiLogout className='he15'/>
                            </div>
                        </div>
                            </motion.div>
                            </div>}
                        </AnimatePresence>
                    </motion.div> 
                ): (
                <Link to={"/auth"}>
                    <div className='he16'>
                        <motion.button  type='button'
                       {...FadeInOutWithOpacity}
                        >Login</motion.button>
                        </div>
                        </Link>
                    )}
                </React.Fragment>
            )}
        </AnimatePresence>
        </div>
        <div className='head'></div>
    </header>
    
  )
}

export default Header
