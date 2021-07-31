import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import M from 'materialize-css';

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setURL] = useState("");

    useEffect(async () => {
        // as url may also change with component mounts 
        if (url) {
            // being asynchronous ops it won't wait for above statements to complete, so it may get us into trouble, so to resolve this we will use useEffect hooks ... so now it will be called only after uploading will be done.
            try {
                const data = await fetch("/createpost", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        title,
                        body,
                        photo: url
                    })
                });
                // it's getting the data but an error data identified by server so it will be getting an error message in objData so using which we can tell about the error.. 
                // console.log(data);
                
                // localStorage.removeItem("jwt");
                // localStorage.removeItem("user");

                const objData = await data.json();
                // console.log(objData);
                if (objData.error) {
                    M.toast({ html: "log in first", classes: "#ff1744 red accent-3" });
                }
                else {
                    M.toast({ html: "post created successfully", classes: "#388e3c green darken-2" });
                    history.push('/');
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }, [url]);

    const postDetails = async () => {
        // for uploading a file we have to use FormData()'s instance and the append the data into it.
        try {
            const data = new FormData();
            data.append("file", image);
            // appending the data on remember named cloudinary
            data.append("upload_preset", "remember");
            // cloud on cloudinary named rohitrkr
            data.append("cloud_name", "rohitrkr");
            const jsondata = await fetch("https://api.cloudinary.com/v1_1/rohitrkr/image/upload", {
                method: "post",
                body: data
            });
            const objdata = await jsondata.json();
            setURL(objdata.url);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="card input-field" style={{
            margin: "38px auto",
            maxWidth: "500px",
            padding: "20px 30px",
            textAlign: "center"
        }}>
            <input type="text" placeholder="title"
                value={body} onChange={(e) => setBody(e.target.value)}
            />
            <input type="text" placeholder="body"
                value={title} onChange={(e) => setTitle(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #42a5f5 blue lighten-1">
                    <span>upload image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={postDetails}>Submit
            </button>
        </div>
    );
}

export default CreatePost;