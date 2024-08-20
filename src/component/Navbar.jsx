import  { useContext } from 'react';
import {Link} from 'react-router-dom';
import { AuthContext } from "../context/Authcontext";
import { useLogout } from "../hooks/useLogout.jsx";
import '../css/Navbar.css';  // Import the Navbar.css

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const { logout } = useLogout();
    
    const handleClick = async () => {
        logout();
    };

    return (
        <div className="navbar">
            <h1>CRUD APPLICATION</h1>
            <div>
                {user ? (
                    <div className='auth'>
                        <h4>{user.email}</h4>
                        <button onClick={handleClick}>Logout</button>
                    </div>
                ) : (
                    <div className='auth'>
                        <Link to="/Login" className='login-d'>
                        <h3 >Login</h3></Link>
                        <Link to="/Signup" className='login-d'>
                        <h3>Sign up</h3></Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
