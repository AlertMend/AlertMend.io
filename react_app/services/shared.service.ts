"use client";
import { config } from "@/constants/config";
import axiosInterceptor from "@/interceptors/axiosInterceptor";

export class SharedService {
  schema: any = '' // Stores schema json to be utilized
  get apiUrl() {
    return config
  }
  // GET method
  get(url: any, params: any = {}) {
    return axiosInterceptor.get(url, { params: params }).then((response: { data: any; }) => response.data);
  }

  // GET FILE method
  getFile(url: any, params: any = {}) {
    return axiosInterceptor.get(url, { params: params, responseType: 'blob' }).then((response: { data: any; }) => response.data)
  }

  // POST method
  post(url: any, data: any) {
    return axiosInterceptor.post(url, data).then((response: { data: any; }) => {
      return response.data
    })
  }

  // POST method
  postFile(url: any, data: any) {
    const formData = new FormData();
    Object.keys(data).forEach((el)=>{
      formData.append(el, data[el]);
    })
    return axiosInterceptor.post(url, data,{
      headers: {
        'Content-Type': 'multipart/form-data', // Set default Content-Type to multipart/form-data
      },
    }).then((response:any) => {
      return response.data
    })
  }

  // PUT method
  put(url: any, data: any) {
    return axiosInterceptor.put(url, data).then((response: { data: any; }) => {
      return response.data
    });
  }

  // PUT method
  putFile(url: any, data: any) {
    const formData = new FormData();
    Object.keys(data).forEach((el)=>{
      formData.append(el, data[el]);
    })
    return axiosInterceptor.put(url, data,{
      headers: {
        'Content-Type': 'multipart/form-data', // Set default Content-Type to multipart/form-data
      },
    }).then((response:any) => {
      return response.data
    })
  }


  // DELETE method
  delete(url: any) {
    return axiosInterceptor.delete(url).then((response: { data: any; }) => {
      return response.data
    });
  }

}