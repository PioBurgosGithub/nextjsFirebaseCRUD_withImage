import { IconButton, ListItem, ListItemText } from '@mui/material'
import moment from 'moment'
import React, { useContext }  from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { doc, deleteDoc } from "firebase/firestore"
import { TodoContext } from '../app/TodoContext'
import { db } from '../firebase'
import { getStorage, ref, deleteObject } from "firebase/storage";


const ToDo = ({id, timestamp, title, detail, imageUrls}) => {
  const {showAlert, setTodo} = useContext(TodoContext)


  /*const deleteTodo = async (id, e) => { 
    e.stopPropagation();
    const docRef = doc(db, "todos", id);
    await deleteDoc(docRef);
    showAlert('error', `Todo with ID: ${id} is deleted successfully!`); }*/ 
  
  
  const storage = getStorage(); // Get the storage instance
  // Delete a todo
  const deleteTodo = async (id, imageUrls, e) => { 
    e.stopPropagation();
    
    // Delete each image from storage
    // Not deleting images from storage
    if (imageUrls && imageUrls.length > 0) {
        console.log("imageUrls:", imageUrls); // to check the imageUrls
        for (const imageUrl of imageUrls) {
            const imageRef = ref(storage, imageUrl);
            try {
                await deleteObject(imageRef);
                console.log(`Image deleted successfully: ${imageUrl}`);
                
            } catch (error) {
                console.error("Error deleting image from storage:", error);
                // Handle error if needed
            }
        }
    }
    //
    
    // Delete the todo from Firestore
    const docRef = doc(db, "todos", id);
    try {
        await deleteDoc(docRef);
        showAlert('error', `Todo with ID: ${id} is deleted successfully!`);
    } catch (error) {
        console.error("Error deleting todo from Firestore:", error);
        // Handle error if needed
    }
  }

  return (
    <ListItem onClick={() => setTodo({id, title, detail, timestamp})}
      sx={{mt: 3, boxShadow: 3}}
      style={{backgroundColor:'#FAFAFA'}}
      secondaryAction={
        <>
          <IconButton onClick={e => deleteTodo(id,  imageUrls, e)}>
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
