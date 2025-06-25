import React from 'react'
import {useLoaderData} from 'react-router-dom'

export const Profile = ()=>{
    // const [data,setData]=useState({});
    // useEffect(() => {
    //     // Fetch user data from GitHub API
    //     fetch(`https://api.github.com/users/${user}`)
    //       .then(res => res.json())
    //       .then(json => setData(json));
    //   }, [user]);
    const data= useLoaderData();
return(
    <>
    <div className="rounded-lg bg-white text-red-600 w-full max-w-7xl font-semibold h-screen">
        <h1>Profile</h1>
        <p className="">Name:  {data.name}</p>
        <p>UserName:  {data.login}</p>
        <img src={data.avatar_url}/>
    </div>
    
    </>
)
}
 export const githubLoaderInfo= async ()=>{
     const response=await fetch('https://api.github.com/users/sour-abh')
    return response.json()
  } 
 