import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import api from '../../services/api'

interface AuthState{
    token:string|null
    loading:boolean
    error:string|null
}

interface AuthResponse{
    accessToken:string
    refreshToken:string
}

interface RegisterCredentials{
    username:string
    password:string
}
interface LoginCredentials{
    username:string
    password:string
}

export const login=createAsyncThunk<AuthResponse,LoginCredentials>(
    'auth/login',
    async(credentials,thunkAPI)=>{
        try{
            const res=await api.post('/auth/login',credentials)
            return res.data
        }
        catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data.message)
        }
    }
)


export const register=createAsyncThunk<AuthResponse,RegisterCredentials>(
    'auth/register',
    async(userData,thunkAPI)=>{
        console.log(userData)
        try{
            const res=await api.post('/auth/register',userData)
            if(res)console.log(res);
            else console.log("no res")
            return res.data
        }
        catch(err:any){
            return thunkAPI.rejectWithValue(err.response?.data?.message??'SOmething went wrong')
        }
    }
)

const initialState:AuthState={
    token:localStorage.getItem('accessToken')||null,
    loading:false,
    error:null,
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        logout:(state)=>{
            state.token=null
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(login.pending,(state)=>{
                state.loading=true
                state.error=null
            })
            .addCase(login.fulfilled,(state,action:PayloadAction<AuthResponse>)=>{
                state.loading=false
                state.token=action.payload.accessToken
                localStorage.setItem('accessToken',action.payload.accessToken)
                localStorage.setItem('refreshToken',action.payload.refreshToken)
            })
            .addCase(login.rejected,(state,action)=>{
                state.loading=false
                state.error=action.payload as string
            })
            //register
            .addCase(register.pending,(state)=>{
                state.loading=true
                state.error=null
            })
            .addCase(register.fulfilled,(state,action:PayloadAction<AuthResponse>)=>{
                state.loading=false
                state.token=action.payload.accessToken
                localStorage.setItem('accessToken',action.payload.accessToken)
                localStorage.setItem('refreshToken',action.payload.refreshToken)
            })
            .addCase(register.rejected,(state,action)=>{
                state.loading=false
                state.error=action.payload as string
            })

    }
})

export const {logout}=authSlice.actions
export default authSlice.reducer