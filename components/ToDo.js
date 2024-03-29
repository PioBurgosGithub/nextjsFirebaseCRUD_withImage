import { IconButton, ListItem, ListItemText } from '@mui/material'
import moment from 'moment'
import React, { useContext }  from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { doc, deleteDoc } from "firebase/firestore"
import { TodoContext } from '../app/TodoContext'
import { db } from '../firebase'

const ToDo = ({id, timestamp, title, detail}) => {
  const {showAlert, setTodo} = useContext(TodoContext)

  const deleteTodo = async (id, e) => { 
    e.stopPropagation();
    const docRef = doc(db, "todos", id);
    await deleteDoc(docRef);
    showAlert('error', `Todo with ID: ${id} is deleted successfully!`);
  }

  return (
    <ListItem onClick={() => setTodo({id, title, detail, timestamp})}
      sx={{mt: 3, boxShadow: 3}}
      style={{backgroundColor:'#FAFAFA'}}
      secondaryAction={
        <>
          <IconButton onClick={e => deleteTodo(id, e)}>
            <DeleteIcon></DeleteIcon>
          </IconButton>

          <IconButton>
            <MoreVertIcon></MoreVertIcon>
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={title}
        secondary={moment(timestamp).format('MMMM do, yyyy')}
      />
    </ListItem>
  )
}

export default ToDo
