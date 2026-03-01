import { BrowserRouter,Routes,Route } from 'react-router'
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Home from './pages/Home'
export default function App(){
    return (
        <BrowserRouter>
        <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        </Routes>
        </BrowserRouter>
    );
}