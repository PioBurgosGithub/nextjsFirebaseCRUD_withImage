"use client"
import React, { useState } from 'react';
import ToDoList from "../components/ToDoList";
import { Alert, Container, Snackbar } from "@mui/material";
import ToDoForm from "@/components/ToDoForm";
import { TodoContext } from "./TodoContext";


export default function Home() {
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [todo, setTodo] = useState({title:'', detail:''});

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setOpen(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  
  return (
    <TodoContext.Provider value={{showAlert, todo, setTodo}}>
      <Container maxWidth='sm'>
        <ToDoForm/>
        <Snackbar 
          anchorOrigin={{vertical:'bottom', horizontal:'center'}}
          open={open} 
          autoHideDuration={6000} 
          onClose={handleClose}
          >
          <Alert onClose={handleClose} severity={alertType} sx={{width: '100%'}}>
            {alertMessage}
          </Alert>
        </Snackbar>

        <ToDoList/>
      </Container>

      </TodoContext.Provider>
  );
}
