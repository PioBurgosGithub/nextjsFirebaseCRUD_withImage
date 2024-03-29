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
        {todos.map(todo=> <ToDo key={todo.id}
            id={todo.id}
            title={todo.title}
            detail={todo.detail}
            timestamp={todo.timestamp}
        />)}
    </div>
  )
}

export default ToDoList