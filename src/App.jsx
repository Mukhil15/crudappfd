import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import "./App.css";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { useAuthContext } from './hooks/useAuthContext';

const App = () => {
  const {user}=useAuthContext();
  return (
    <>
      <BrowserRouter>

      <Routes>
        <Route path='/' element={user?<Home/>:<Navigate to="/Login"/>}/>
        <Route path='/Signup' element={!user?<Signup/>:<Navigate to="/"/>}/>
        <Route path='/Login' element={!user?<Login/>:<Navigate to="/"/>}/>
      </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
