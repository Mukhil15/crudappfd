import { useState } from "react";
import { useLogin } from '../hooks/useLogin';
import Navbar from "../component/Navbar.jsx";
import '../css/Login.css'; // Import the Login.css

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login,isLoading,error } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <>
            <Navbar />
            <div className="container">
            <form className="login" onSubmit={handleSubmit}>
                <h3>Login</h3>
                <label>Email:</label>
                <input 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                />
                <label>Password:</label>
                <input 
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password} 
                />
                <button disabled={isLoading}>Login</button>
                
            </form>
            {error && <h3 className="error">The error : {error}</h3>}
            </div>
        </>
    );
}

export default Login;
