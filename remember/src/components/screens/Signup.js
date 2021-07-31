import React, { useState,useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';



const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [url, setURL] = useState(undefined);

    useEffect(()=>{
        if (url){
            uploadFields();
        }
    }, [url]);

    const uploadPic = async () => {
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

    const uploadFields = async ()=>{
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            M.toast({ html: "invalid email", classes: "#ff1744 red accent-3" });
            return;
        }
        try {
            const data = await fetch("/signup", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    photo:url
                })
            });
            // it's getting the data but an error data identified by server so it will be getting an error message in objData so using which we can tell about the error.. 
            console.log(data);
            const objData = await data.json();
            // console.log(objData);
            if (objData.error) {
                M.toast({ html: objData.error, classes: "#ff1744 red accent-3" });
            }
            else {
                M.toast({ html: "Registered successfully", classes: "#388e3c green darken-2" });
                history.push('/signin');
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const postData = async () => {
        if (image){
            uploadPic();
        }
        else {
        uploadFields();
        }
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input type="text" placeholder="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type="password" placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn #42a5f5 blue lighten-1">
                        <span>upload profile pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={postData}>
                    Signup
                </button>
                <h5>
                    <Link to="/signin"> Already have an account ?</Link>
                </h5>
            </div>

        </div>
    );
}

export default Signup;