"use client"
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore'
import { db } from '../firebase' // Importing the db variable from firebase.js
import ToDo from './ToDo'

const ToDoList = () => {
    const [todos, setTodos] = useState([])

    useEffect(() => {
        const collectionRef = collection(db, "todos")

        const q = query(collectionRef, orderBy("timestamp", "desc"));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setTodos(querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime()
            })));
        });
        return unsubscribe;

    }, [])



    return (
        <div>
            {todos.map(todo => (
                <div key={todo.id}>
                    <ToDo 
                        id={todo.id}
                        title={todo.title}
                        detail={todo.detail}
                        timestamp={todo.timestamp}
                        imageUrl={todo.imageUrl}  // Pass imageUrl as a prop
                    />

                    {/* Display Multiple Images */}
                    {Array.isArray(todo.imageUrl) ? todo.imageUrl.map((url, index) => (
                        <div key={index}>
                            <img className='w-[300px] my-4' src={url} alt={`${todo.title}-${index}`} />
                            {/*<p>{url}</p>*/}
                        </div>
                    )) : (
                        <div>
                            <img className='w-[300px] my-2.5' src={todo.imageUrl} alt={todo.title} />
                            {/*<p>{todo.imageUrl}</p>*/}
                        </div>
                    )}

                </div>
            ))}
        </div>
    )
}

export default ToDoList