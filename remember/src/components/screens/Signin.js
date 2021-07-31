import React, { useState,useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {UserContext} from '../../App';
import M from 'materialize-css';

const Signin = () => {
    const {state,dispatch} = useContext(UserContext);
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    // posting this data to the backend
    const postData = async () => {

        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            M.toast({ html: "invalid email", classes: "#ff1744 red accent-3" });
            return;
        }

        try {
            const data = await fetch("/signin", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            // it's getting the data but an error data identified by server so it will be getting an error message in objData so using which we can tell about the error.. 
            // console.log(data);
            const objData = await data.json();
            // console.log(objData);
            if (objData.error) {
                M.toast({ html: objData.error, classes: "#ff1744 red accent-3" });
            }
            else {
                // we will use local storage to store the token info
                localStorage.setItem("jwt",objData.token);
                localStorage.setItem("user",JSON.stringify(objData.user));
                dispatch({type:"USER",payload:objData.user});
                M.toast({ html: objData.message, classes: "#388e3c green darken-2" });
                history.push('/');
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" placeholder="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type="password" placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={postData}>
                    Submit
                </button>
                <h5>
                    <Link to="/signup"> Don't have an account ?</Link>
                </h5>
            </div>
        </div>
    );
}

export default Signin;