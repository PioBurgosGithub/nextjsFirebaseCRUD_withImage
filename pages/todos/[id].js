import React from 'react'
import { Grid } from '@mui/material'
import { doc, collection, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
const Detail = ({todoProps}) => {
  const todo = JSON.parse(todoProps)
    return (
    <Grid 
    container
    spacing={0}

    direction="column"
    alignItems="center"
    justifyContent="center"
    style={{minHeight: '100vh'}}
    >
        {todo.title}: {todo.detail}
        
        {/* Display the images */}
        {todo.imageUrl && todo.imageUrl.map((url, index) => (
            <img key={index} src={url} alt={`Image ${index}`} />
        ))}


    </Grid>
  )
}

export default Detail


export const getStaticPaths = async () => {
    const snapshot = await getDocs(collection(db, "todos"));
    const paths = snapshot.docs.map(doc => {
        return{
            params: {id: doc.id.toString() }
        }
    })

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async (context) => {
    const id = context.params.id;
    
    const docRef = doc(db, "todos", id);
    const docSnap = await getDoc(docRef);

    return { 
        props: { todoProps: JSON.stringify(docSnap.data()) || null}
    }
}