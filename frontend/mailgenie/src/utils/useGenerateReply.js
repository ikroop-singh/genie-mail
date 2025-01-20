import  { useState } from 'react'
import axios from 'axios';

const useGenerateReply = () => {
    axios.defaults.baseURL = "http://localhost:8080";

    const[loading,setloading]=useState(false);
    const[result,setResult]=useState(null);
    const[error,setError]=useState(null);

    const generateReply=async(data)=>{
        setloading(true);     
        
        try {
            const res=await axios.post("/api/email/generate",data);

            setResult(res.data);
            
        } catch (error) {
            setError("Something went wrong")
        }
        finally{
            setloading(false);
        }
    }
    return [loading,generateReply,result,setResult,error];

}

export default useGenerateReply