"use client"
import React, { useState, useContext, useRef, useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
import {db} from '../firebase'
import { TodoContext } from '../app/TodoContext'
import { storage } from '../firebase'
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid';



const ToDoForm = () => {
    const inputAreaRef = useRef();
    // Image Upload code
    const [imageUpload, setImageUpload] = useState(null); 
    const [imagePreviews, setImagePreviews] = useState([]);

    const uploadImage = async () => {
        if (imageUpload == null) return null;
      /*  const imageRef = ref(storage, `images/${imageUpload.name + uuidv4()}`);
        await uploadBytes(imageRef, imageUpload);
        const url = await getDownloadURL(imageRef);
        return url;*/

        const urls = [];
        for (let i = 0; i < imageUpload.length; i++) {
            const imageRef = ref(storage, `images/${imageUpload[i].name + uuidv4()}`);
            await uploadBytes(imageRef, imageUpload[i])
                .then(() => {
                    console.log("success");
                })
                .catch((error) => {
                    console.log("error");
                });
    
            const url = await getDownloadURL(imageRef);
            urls.push(url);
        }
    
        return urls;
    };


    //

    //Image show code
    const[imageList, setImageList] = useState([]);
    const imageListRef = ref(storage, 'images/');

    //

    const {showAlert, todo, setTodo} = useContext(TodoContext)

    
    const onSubmit = async () => {
        if (todo?.hasOwnProperty('timestamp')) {
            // Call the uploadImage function here
            const imageUrl = await uploadImage();
            
            // update the todo
            const docRef = doc(db, "todos", todo.id);
            const todoUpdated = { ...todo, imageUrl, timestamp: serverTimestamp() }
            updateDoc(docRef, todoUpdated)
            setTodo({title: '', detail: ''});
            showAlert('info', `Todo with ID: ${todo.id} is updated successfully!`);  

        } 
        else{
            // Call the uploadImage function here
            const imageUrl = await uploadImage();
            
            // add a new todo
            const collectionRef = collection(db, "todos")
            const docRef = await addDoc(collectionRef, { ...todo, imageUrl, timestamp: serverTimestamp() })
            setTodo({title:'', detail:''})

            showAlert('success',`Todo with ID: ${docRef.id} is added succesfully!`)
        }
    }


    useEffect(() => {
        // Check if clicked outside
        const chekIfClickedOutside = (e) => {
            if(!inputAreaRef.current.contains(e.target)) {
                console.log('Outside input area');
                setTodo({title:'', detail:''})
            } else{
                console.log('Inside input area');
            }
        }
        document.addEventListener('mousedown', chekIfClickedOutside)
    
        // Fetch images
        listAll(imageListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageList((prev) => [...prev, url]);
                });
            });
        });
    
        // Cleanup
        return () => {
            document.removeEventListener('mousedown', chekIfClickedOutside)
        }
    }, []);

   

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
            {/*Image Upload code */}
            <div>
                <input 
                    type="file" 
                    multiple
                    onChange={(event) => {
                        setImageUpload(event.target.files) // setImageUpload(event.target.files[0]) for single image upload
                        setImagePreviews(Array.from(event.target.files).map(file => URL.createObjectURL(file)));
                    }} 
                />
                
                {/* Display the image */}
                <div>
                    {/* Display the images that were saved earlier */}
                    {todo.imageUrl && todo.imageUrl.map((url, index) => (
                        <img key={index} src={url} alt={`Saved image ${index}`} />
                    ))}

                    {/* Display the image previews */}          
                    {imagePreviews.map((url, index) => (
                        <img key={index} src={url} alt={`Preview ${index}`} />
                    ))}
                </div>
            </div>
            <Button onClick={onSubmit} sx={{ mt:3 }}> {todo.hasOwnProperty('timestamp') ? 'Update todo': ' Add a new Todo'}  </Button>
        </div>
  )
}

export default ToDoForm