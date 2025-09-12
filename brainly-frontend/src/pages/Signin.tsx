import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import {useRef} from 'react'
import {BACKEND_URL} from '../../config.ts'
import axios from 'axios'
import {useState} from 'react'
import { useNavigate } from "react-router-dom";

export function Signin()
{
    const [err, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const usernameref = useRef<HTMLInputElement>();
    const passwordref = useRef<HTMLInputElement>();

    async function signin()
    {
        setLoading(true);
        setError('');

        const username = usernameref.current?.value;
        const password = passwordref.current?.value;

        if (!username || !password) {
            setError('Please fill out all fields.');
            setLoading(false);
            return;
        }

        try {
            // This is the "happy path"
            const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password
            });

            
            const jwt = response.data.authorization
            localStorage.setItem("token", jwt)
            navigate('/dashboard')
            

        } catch (err) {
            // This block runs ONLY if axios.post fails
            console.error("An error occurred during signin:", err);
            setError("Signup failed. Please try again.");
        
        } finally {
            // This block runs regardless of success or failure
            setLoading(false);
        }
    }

    return <div className = "h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
        <Input ref ={usernameref} placeholder = "username"/>
        <Input ref ={passwordref} placeholder = "password"/>
        <div className="flex justify-center pt-4">
        <Button onClick = {signin} variant="primary" text="signin" size = "md"/>
        </div>
        </div>
    </div>
}