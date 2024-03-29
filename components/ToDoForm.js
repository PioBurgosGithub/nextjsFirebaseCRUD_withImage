"use client"
import React, { useState, useContext, useRef, useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
import {db} from '../firebase'
import { TodoContext } from '../app/TodoContext'



const ToDoForm = () => {
    const inputAreaRef = useRef();
    

    const {showAlert, todo, setTodo} = useContext(TodoContext)
    const onSubmit = async () => {
        if (todo?.hasOwnProperty('timestamp')) {
            // update the todo
            const docRef = doc(db, "todos", todo.id);
            const todoUpdated = { ...todo, timestamp: serverTimestamp() }
            updateDoc(docRef, todoUpdated)
            setTodo({title: '', detail: ''});
            showAlert('info', `Todo with ID: ${todo.id} is updated successfully!`);  
        } 
        else{
            // add a new todo
            const collectionRef = collection(db, "todos")
            const docRef = await addDoc(collectionRef, { ...todo, timestamp: 
            serverTimestamp() })
            setTodo({title:'', detail:''})
            showAlert('success',`Todo with ID: ${docRef.id} is added succesfully!`)

        }

        
        
            
    }

    useEffect(() => {
        const chekIfClickedOutside = (e) => {
            if(!inputAreaRef.current.contains(e.target)) {
                console.log('Outside input area');
                setTodo({title:'', detail:''})
            } else{
                console.log('Inside input area');
            }
        }
        document.addEventListener('mousedown', chekIfClickedOutside)
        return () => {
            document.removeEventListener('mousedown', chekIfClickedOutside)
        }
    }, []) 

  return (
    <div ref={inputAreaRef}>
        <TextField fullWidth label="title" margin="normal"
            value={todo.title}
            onChange={e => setTodo({...todo, title:e.target.value})}
        />
        <TextField fullWidth label="detail" multiline maxRows={4} 
            value={todo.detail}
            onChange={e => setTodo({...todo, detail:e.target.value})}
        />
        <Button onClick={onSubmit} sx={{ mt:3 }}> {todo.hasOwnProperty('timestamp') ? 'Update todo': ' Add a new Todo'}  </Button>
        
        
    </div>
  )
}

export default ToDoForm