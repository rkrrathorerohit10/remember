import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const [userProfile, setProfile] = useState(null);
    
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showFollow, setShowFollow] = useState(state?!state.following.includes(userid):true);
    // console.log(userid);
    useEffect(async () => {
        try {
            const jsonData = await fetch(`/user/${userid}`, {
                headers: {
                    "Authorization": localStorage.getItem("jwt")
                }
            });
            const jsData = await jsonData.json();
            // console.log(jsData);

            setProfile(jsData);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const followUser = async () => {
        try {
            const jsonData = await fetch('/follow', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    followId: userid
                })
            });
            // this is the date of logged in user. it means it contains the updated count of following but not updated count of followers 
            const jsData = await jsonData.json();
            console.log(jsData);
            // saving the state in reducer 
            dispatch({ type: "UPDATE", payload: { following: jsData.following, followers: jsData.followers } });
            localStorage.setItem("user", JSON.stringify(jsData));
            // updating the followers of the userProfile
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, jsData._id]
                        // appending the follower to prestate fo the user
                    }
                }
            })
            setShowFollow(false);
        } catch (error) {
            console.log(error);
        }
    }

    const unfollowUser = async () => {
        try {
            const jsonData = await fetch('/unfollow', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    unfollowId: userid
                })
            });
            // this is the data of logged in user. it means it contains the updated count of following but not updated count of followers 
            const jsData = await jsonData.json();
            console.log(jsData);
            // saving the state in reducer 
            dispatch({ type: "UPDATE", payload: { following: jsData.following, followers: jsData.followers } });
            localStorage.setItem("user", JSON.stringify(jsData));
            // updating the followers of the userProfile
            setProfile((prevState) => {
                const newFollowers = prevState.user.followers.filter(item => item !== jsData._id);

                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollowers
                        // appending the follower to prestate for the user
                    }
                }
            })
            setShowFollow(true);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            {userProfile ?
                <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                    {/* profile pic and the user info */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        {/* profile pic  */}
                        <div>
                            <img style={{ height: "160px", width: "160px", borderRadius: "80px" }} src={userProfile.user.photo} alt="loading"></img>
                        </div>
                        {/*  user info */}
                        <div>
                            <h4> {userProfile.user.name} </h4>
                            <h4> {userProfile.user.email} </h4>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "108%"
                            }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                            {!showFollow ? <button className="btn waves-effect waves-light #c62828 red darken-3" onClick={() => unfollowUser()}>
                                unfollow
                            </button> :
                                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={() => followUser()}>
                                    follow
                                </button>
                            }



                        </div>
                    </div>
                    {/* Gallery section for the user */}
                    <div className="gallery">
                        {
                            userProfile.posts.map((item) => {
                                return (
                                    <img className="items" key={item._id} src={item.photo} alt={item.title}></img>
                                );
                            })
                        }
                    </div>
                </div>
                : <h2>loading...!</h2>}
        </>
    );
}

export default Profile;