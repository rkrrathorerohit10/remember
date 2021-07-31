import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

const Profile = () => {
    const [photo, setPhoto] = useState("");
    // const [url, setURL] = useState(undefined);
    const [myPhotos, setMyPhotos] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    // console.log(state);
    useEffect(async () => {
        try {
            const jsonData = await fetch("/myposts", {
                headers: {
                    "Authorization": localStorage.getItem("jwt")
                }
            });
            const jsData = await jsonData.json();
            // console.log(jsData);
            setMyPhotos(jsData);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(async () => {
        if (photo) {
            try {
                const data = new FormData();
                data.append("file", photo);
                // appending the data on remember named cloudinary
                data.append("upload_preset", "remember");
                // cloud on cloudinary named rohitrkr
                data.append("cloud_name", "rohitrkr");
                const jsondata = await fetch("https://api.cloudinary.com/v1_1/rohitrkr/image/upload", {
                    method: "post",
                    body: data
                });
                const objdata = await jsondata.json();
                // console.log(objdata);

                // localStorage.setItem("user", JSON.stringify({ ...state, photo: objdata.url }));
                // dispatch({ type: "UPDATEPIC", payload: objdata.url });

                const updatedPhoto = await fetch('/updatepic', {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        photo: objdata.url
                    })
                });

                const result = await updatedPhoto.json();
                // console.log(result);

                localStorage.setItem("user", JSON.stringify({ ...state, photo: result.photo }));

                dispatch({ type: "UPDATEPIC", payload: result.photo });
                // window.location.reload();
            } catch (error) {
                console.log(error);
            }
        }
    }, [photo]);

    const updatePhoto = (file) => {
        // console.log(file);
        setPhoto(file);
    }

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            {/* profile pic and the user info */}
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    {/* profile pic  */}
                    <div>
                        <img style={{ height: "160px", width: "160px", borderRadius: "80px" }} src={state ? state.photo : ""}></img>
                    </div>
                    {/* <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" style={{margin:"5px 4px 15px 4px"}} onClick={()=>{
                    updatePhoto();
                }}>
                    update profile pic
                </button> */}
                    <div className="file-field input-field" style={{ margin: "10px" }}>
                        <div className="btn #42a5f5 blue lighten-1">
                            <span>update pic</span>
                            <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                </div>
                {/*  user info */}
                <div>
                    <h4> {state ? state.name : "loading"} </h4>
                    <h4> {state ? state.email : "loading"} </h4>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "108%"
                    }}>
                        <h6>{myPhotos.length} posts</h6>
                        <h6>{state ? state.followers.length : 0} followers</h6>
                        <h6>{state ? state.following.length : 0} following</h6>
                    </div>
                </div>
            </div>
            {/* Gallery section for the user */}
            <div className="gallery">
                {
                    myPhotos.map((item) => {
                        return (
                            <img className="items" key={item._id} src={item.photo} alt={item.title}></img>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Profile;