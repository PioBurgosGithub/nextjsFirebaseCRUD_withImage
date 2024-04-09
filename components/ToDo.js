import { IconButton, ListItem, ListItemText } from '@mui/material'
import moment from 'moment'
import React, { useContext }  from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { doc, deleteDoc } from "firebase/firestore"
import { TodoContext } from '../app/TodoContext'
import { db } from '../firebase'
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useRouter } from 'next/navigation';


const ToDo = ({id, timestamp, title, detail, imageUrl}) => {
  const {showAlert, setTodo} = useContext(TodoContext)
  const router = useRouter();

  const storage = getStorage(); // Get the storage instance
  
  // Delete a todo
  const deleteTodo = async (id, imageUrl , e) => { 
    e.stopPropagation();

    // Delete each image from storage
    if (imageUrl && imageUrl.length > 0) {
        console.log("imageUrls:", imageUrl); // to check the imageUrls
        for (const url of imageUrl) {
            const imageRef = ref(storage, url);
            try {
                await deleteObject(imageRef);
                console.log(`Image deleted successfully: ${url}`);
            } catch (error) {
                console.error("Error deleting image from storage:", error);
                // Handle error if needed
            }
        }
    }

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
  


  const seeMore = (id, e) => {
    e.stopPropagation();
    router.push(`/todos/${id}`);
  }

  
  return (
    <ListItem onClick={() => setTodo({id, title, detail, timestamp})}
      sx={{mt: 3, boxShadow: 3}}
      style={{backgroundColor:'#FAFAFA'}}
      secondaryAction={
        <>
          <IconButton onClick={e => deleteTodo(id,  imageUrl, e)}>
            <DeleteIcon></DeleteIcon>
          </IconButton>

          <IconButton onClick={e => seeMore(id, e)} >
            <MoreVertIcon></MoreVertIcon>
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={title}
        secondary={moment(timestamp).format('MMMM Do, yyyy')}
      />
    </ListItem>
  )
}

export default ToDo
