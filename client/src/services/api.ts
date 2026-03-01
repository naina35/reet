import axios from 'axios'
 
const api=axios.create({
    baseURL:'https://reet-i4vt.onrender.com',
})

api.interceptors.request.use((config)=>{
    const token=localStorage.getItem('accessToken')
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
})

export default api