//component to store and update data(like user input) dynamically
import { useState } from "react";

//declaring postform component 
export default function PostForm() {
    //initializing states to store user inputs(title and content)
    //functiond used to update the state (setTitle & setContent)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    //handling form submission 
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("New post: ", { title, content })
        setTitle("")
        setContent("")
        alert(`the post is created ${title}, ${content}`)
    }


//rendering the form html
return (
    <form onSubmit={handleSubmit}>
        <h2>Create a Post</h2>
        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
        />
        <textarea 
            placeholder="write your post here..."
            value={content}
            onChange={(e)=> setContent(e.target.value)}
            required
        ></textarea>
        <button type="submit">Post</button>
    </form>
)
};
