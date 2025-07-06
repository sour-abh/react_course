import React ,{useState,useEffect}from 'react'
import appwriteService from "../appwrite/config";
import {Container,Postcard} from '../components'

function AllPosts() {

    const [posts,setPosts]= useState([])

    useEffect(()=>{

    appwriteService.getPosts([]).then((posts) =>{
        if(posts){
            setPosts(posts.documents)
        }
    })
},[])


  return (
    <div className='w-full py-8'>
        <Container>
            {posts.map((post)=>
        <Postcard key={post.$id}{...post}/>

    )}
        </Container>
    </div>
  )
}

export default AllPosts