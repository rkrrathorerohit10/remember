import React, { useEffect, useState, useContext } from 'react';
import {Link} from 'react-router-dom';
import { UserContext } from '../../App';

const Home = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    useEffect(async () => {
        try {
            const jsonData = await fetch("/allposts", {
                headers: {
                    "Authorization": localStorage.getItem("jwt")
                }
            });
            const jsData = await jsonData.json();
            // console.log(jsData);
            setData(jsData);
        } catch (error) {
            console.log(error);
        }
    }, []); // passing an empty array here means that it will be fired only when it will load, after that there is nothing 'on change in which' it will fire again..

    const likePost = async (id) => {
        try {
            const jsonData = await fetch("/like", {
                method: "put",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    postId: id
                })
            });
            const jsData = await jsonData.json();
            // console.log(jsData);
            const newData = data.map((item) => {
                if (item._id == jsData._id) {
                    return jsData;
                } else {
                    return item;
                }
            });
            setData(newData);

        } catch (error) {
            console.log(error);
        }
    }

    const unlikePost = async (id) => {
        try {
            const jsonData = await fetch("/unlike", {
                method: "put",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    postId: id
                })
            });
            const jsData = await jsonData.json();
            // console.log(jsData);
            const newData = data.map((item) => {
                if (item._id == jsData._id) {
                    return jsData;
                } else {
                    return item;
                }
            });
            setData(newData);
        } catch (error) {
            console.log(error);
        }
    }

    const makeComment = async (text, postId) => {
        try {
            const jsonData = await fetch("/comment", {
                method: "put",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    postId,
                    text
                })
            });
            const jsData = await jsonData.json();
            console.log(jsData);
            const newData = data.map((item) => {
                if (item._id == jsData._id) {
                    return jsData;
                } else {
                    return item;
                }
            });
            setData(newData);
        } catch (error) {
            console.log(error);
        }
    }

    const deletePost = async (postId) => {
        try {
            const jsonData = await fetch(`/deletepost/${postId}`, {
                method: "delete",
                headers: {
                    "Authorization": localStorage.getItem("jwt")
                }
            });

            const jsData = await jsonData.json();
            console.log(jsData);
            // we are filtering out the deleted record 
            const newData = data.filter(item=>{
                // all the post those do not have the same post id as of item id will become posts again
                return item._id !== jsData._id;
            });
            setData(newData);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>
                            {item.postedBy.name}
                            </Link>
                            {/* if _id's are same then show the delete icon on the post else not */}
                            {item.postedBy._id === state._id && <i className="material-icons" style={{ float: "right" }}  
                            onClick={()=>deletePost(item._id)}>delete</i>}
                            </h5>
                            <div className="card-image">
                                <img src={item.photo}></img>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" >favorite</i>
                                {
                                    item.likes.includes(state._id) ?
                                        <i className="material-icons"
                                            onClick={(e) => {
                                                unlikePost(item._id);
                                            }}> thumb_down </i> :
                                        <i className="material-icons"
                                            onClick={(e) => {
                                                likePost(item._id);
                                            }}> thumb_up </i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title} </h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map((record) => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}</h6>
                                        );
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id);
                                }}>
                                    <input type="text" placeholder="comment" />
                                </form>
                            </div>
                        </div>
                    );
                })
            }

        </div>
    );
}

export default Home;

