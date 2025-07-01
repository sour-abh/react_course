import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {removeTodo} from '../features/todo/todoSlice'

function Todos(){

    const todos=useSelector(state=>state.todos)
    const dispatch= useDispatch()

    return (

        <>
        <div className="text-xl font-semibold text-blue-800 mt-5 ">Todos</div>
        <ul clasName="list-none">
            {todos.map((todo)=>(
                <li className="mt-4 flex justify-between items-center bg-zinc-800 px-4 rounded" key={todo.id}>
                    <div className='text-white'>{todo.text}</div>
                    <button onClick={()=> dispatch(removeTodo(todo.id))} className=' text-white bg-red-500 border-0 py-1 px-4 focus:outline-none mx-1 my-2 rounded-lg'>X</button>
                </li>


            ))}
        </ul>
        </>
    )

}
export default Todos