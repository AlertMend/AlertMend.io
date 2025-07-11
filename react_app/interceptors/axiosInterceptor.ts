'use client'
import { config } from '@/constants/config';
import axios from 'axios';


const axiosInterceptor = axios.create({
  baseURL: config, // Replace with your API base URL
});


// Request interceptor
axiosInterceptor.interceptors.request.use(
  (con) => {
    // Modify the request config here (add headers, authentication tokens)
    const accessToken = localStorage.getItem("token") ;

    // If token is present add it to request's Authorization Header
    if (accessToken) {
      if (con.headers) con.headers.token = accessToken;
    }
    return con;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(new Error(error));
  }
);
// End of Request interceptor



// Response interceptor
axiosInterceptor.interceptors.response.use(
  (response) => {
    // Modify the response data here

    return response;
  },
  (error) => {
    // Handle response errors here
    if(error.response.status=='401'){
      window.location.href = '/';
    }
    if(error.response.status=='403'){
      logout()
    }
    return Promise.reject(error.response)// NOSONAR;
  }
);
// End of Response interceptor
function logout(){
  localStorage.clear()
  if(!window.location.href.includes('/login')){
    window.location.href = '/login';
  }
}
export default axiosInterceptor;
