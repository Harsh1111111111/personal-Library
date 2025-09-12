import { BACKEND_URL } from "../../../config";
import { CrossIcon } from "../../icons/cross";
import { Button } from "./Button";
import {Input} from "./input"
import {useState,useRef} from 'react'
import axios from 'axios'



interface x{
    open:boolean,
    onClose?:any,
}

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

export function CreateContentModel ({open, onClose} :x)
{   

    const titleref = useRef<HTMLInputElement>()
    const linkref = useRef<HTMLInputElement>()
    const [type , setType] = useState(ContentType.Youtube);

    async function addContent()
    {
        const title = titleref.current?.value;
        const link = linkref.current?.value;

        await axios.post(`${BACKEND_URL}/api/v1/content`,{
            title, 
            link,
            type

        },{
            headers:{
                "Authorization" : localStorage.getItem("authorization")
            }
        });
        onClose()
    }
    return <div>
        {open && <div className=" fixed w-full h-full bg-black/50 fixed top-0 left-0 flex justify-center">

            <div className="flex flex-col justify-center">
                <div className="bg-white  p-4 rounded"> 
                    <div className="flex justify-end ">
                        <div  className = "cursor-pointer"onClick={onClose}>
                            <CrossIcon size = "md"/>
                        </div>
                    </div>
                    <div>
                        <Input ref = {titleref} placeholder="Title" />
                        <Input ref = {linkref}  placeholder="Link" />

                    </div>
                    <div className="flex justify-center gap-2">
                        <Button 

                            size = "sm"
                            text = "Youtube" 
                            variant = { type == ContentType.Youtube ? "primary" : "secondary"} 
                            onClick = {() => setType(ContentType.Youtube)}
                        />

                        <Button 
                            size = "sm"
                            text = "Twitter" 
                            variant = { type == ContentType.Twitter ? "primary" : "secondary"} 
                            onClick={() => setType(ContentType.Twitter)}
                        />
                    </div>
                    <div className=" flex justify-center bg-white opacity-100 p-4 rounded">
                        <Button onClick={addContent} variant = "primary" size ="md" text="Submit" />
                    </div>


                </div>
                
            </div>
        </div>}

    </div>
}



