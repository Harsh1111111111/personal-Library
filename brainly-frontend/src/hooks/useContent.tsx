import {useEffect, useState} from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../../config';

export function useContent ()
{
    const [content, setContent] = useState([]);

    function refresh()
    {
        axios.get(`${BACKEND_URL}/api/v1/content`,{
            headers:{
                "authorization" : localStorage.getItem("authorization")
            }
        }).then((response)=>{
            setContent(response.data.content)
        })
    
    }
    useEffect(()=>{
        refresh()
        let interval = setInterval(() => {
            refresh()
        },1000)
        return () => {
            clearInterval(interval);
        }
    },[])

    return {content, refresh}
   
}