import React, { useContext } from 'react';
import { Link,useHistory } from 'react-router-dom';
import { UserContext } from '../App';
// using link will make pages to not refreshing for all different routings they will be refreshed in place. makes it a single click page


const Navbar = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);
    // here the state consists of user details
    const renderList = () => {
        if (state) {
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/createpost" > Create Post</Link></li>,
                <li><button className="btn waves-effect waves-light #ff1744 red accent-3" onClick={()=>{
                    localStorage.clear();
                    dispatch({type:"CLEAR"});
                    history.push('/signin')
                }}>
                    Sign Out
                </button></li>
            ]
        }
        else {
            return [
                <li><Link to="/signin">Signin</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                {/* if user avalable render home page else send to signin page  */}
                <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                {/* <Link to="/" className="brand-logo left">Instagram</Link> */}
                <ul id="nav-mobile" className="right">
                    {renderList()}
                    {/* <li><Link to="/signin">Signin</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/createpost" > Create Post</Link></li> */}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;