import {useState} from 'react';
// import type { RootState } from '../redux/store'
// import { useSelector, useDispatch } from 'react-redux'
import { useAppDispatch,useAppSelector } from '../hooks/useAppDispatch';
import { useNavigate } from 'react-router';
import { register } from '../redux/auth/authSlice';

export default function Register(){
    const dispatch=useAppDispatch()
    const navigate=useNavigate()
    const {loading,error}=useAppSelector((state)=>state.auth)
    const [newUser,setNewUser]=useState({
        username:'',
        password:'',
    });
    const handleChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=event.target;
        setNewUser((prevState)=>({
            ...prevState,
            [name]:value,
        }));
    }
    const handleSubmit=async(event:React.SubmitEvent)=>{
        console.log("handle submit")
        event.preventDefault();
        const result=await dispatch(register(newUser));
        console.log(result);
        if(register.fulfilled.match(result)){
            navigate('/profile');
        }
    }
    return (
        <div id="register">
            <form onSubmit={handleSubmit}>
            <label>Username: <br/>
            <input type='text' name="username" value={newUser.username} onChange={handleChange}></input>
            </label> <br/>
            <label>Password: <br/>
            <input type='text' name="password" value={newUser.password} onChange={handleChange}></input>
            </label> <br/>
            {error && <p>{error}</p>}
            <button type="submit" disabled={loading} >{loading?'Registering...':'Register'}</button>
        </form>
        </div>
    );
}