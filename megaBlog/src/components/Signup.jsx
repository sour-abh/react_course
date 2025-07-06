import React,{useState} from 'react'
import authService from '../appwrite/auth'
import {Link,useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice';
import {Button,Input,Logo} from './index'
import {useDispatch} from 'react-redux';
import {useForm} from 'react-hook-form'

function Signup(){
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const {register,handleSubmit}=useForm()
    const [error,setError]=useState("")

    const create= async(data)=>{


        setError("")
        try{
            const sessionData=await authService.createAccount(data)
            if(sessionData){
                const userData=await authService.getCurrentUser()
                if(userData){
                    dispatch(login({userData}))
                    navigate("/")
                    return true;
                } else {
                    console.error("Signup :: failed to get user data after successful account creation", {
                        sessionId: sessionData?.$id,
                        email: data.email,
                        name: data.name,
                        timestamp: new Date().toISOString()
                    });
                    setError("Account created but failed to retrieve user information. Please try logging in.");
                    return false;
                }
            } else {
                console.error("Signup :: no session returned from account creation", {
                    email: data.email,
                    name: data.name,
                    timestamp: new Date().toISOString()
                });
                setError("Account creation failed. Please try again.");
                return false;
            }

        }catch(error){
            console.error("Signup :: component error", {
                error: error.message,
                stack: error.stack,
                email: data.email,
                name: data.name,
                timestamp: new Date().toISOString()
            });
            setError(error.message || "An unexpected error occurred during account creation.");
            return false;
        }
    }
    return(
        <div className="flex items-center jusstify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                <span className="inline-block w-full max-w-[100px]">
                    <Logo width="100%"/>
                </span>
            </div>
            <h2 className="text-cetner text-2xl font-bold leading-tight">Sign up tp create account</h2>
            <p className="mt-2 text-center text-base text-black/60">
            Already have an account?&nbsp;
            <Link to="/login"
            className='font-medium text-primary transition-all duration-200 hover-underline'> Sign In</Link>
            </p>

            {error && <p className="text-red-600  mt-8 tet-center">{error}</p>}

            <form onSubmit={handleSubmit(create)}>
                <div className="space-y-5">
                    <Input label="Full Name: " placeholder="Enter your full name" {...register("name",{required:true,})} />

                    <Input label="Email" placeholder="enter your email"
                                    type='email'
                                    {...register("email",{required:true,validate:{matchPatern:(value)=> /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(value) || "Email address mut be a valid address."}})}
                                    />

                        <Input label="Password: "
                                        type="password" placeholder="Enter uour password" {...register('password',{required:true})}/>



                        <Button type='submit' className='w-full'>Create Account</Button> 
                       
                        </div>

            </form>
            </div>

        </div>
    )

}
export default Signup

