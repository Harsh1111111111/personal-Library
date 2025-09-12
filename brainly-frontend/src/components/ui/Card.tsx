import { BACKEND_URL } from "../../../config";
import { useContent } from "../../hooks/useContent";
import { CrossIcon } from "../../icons/cross";
import { ShareIcon } from "../../icons/share";
import axios from "axios";

interface CardProps
{

    title : string, 
    link : string, 
    type :"youtube" | "tweet",

}


const defaultStyles = "p-8 bg-white rounded-md shadow-md border-gray-100 max-w-96 border"
const foricons = "text-grey-500";

export const Card = (props : CardProps) =>
{
    
    return <div>
        <div className = {`${defaultStyles}`}>
                    <div className ={`flex justify-between`}>
                        <div className = "flex items-center text-md"> 
                            <div className = "text-grey-500 pr-2" > <ShareIcon size = "md"/> </div>
                            {props.title}

                        </div>    
                        <div className="flex items-center">
                            <div className = {`pr-2 ${foricons} `}>
                                <a href = {props.link} target = "_blank">
                                     <ShareIcon size = "md"/> 
                                </a>
                            </div>
                            <div className = {`pr-2 ${foricons} cursor-pointer`}>
                                     <CrossIcon size = "md2" /> 
                            </div>
                        </div>
                    </div>

                    <div className = "pt-4">
                    
                        {/* for video  */}

                        {props.type == "youtube" && 
                        <iframe className = "w-full"
                        src={props.link.replace("watch?v=","embed/")} 
                        title="Youtube Video Player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
                        </iframe>
                        }

                        {/* for tweet */}

                        {props.type == "tweet" &&  <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
                        {/* 3. Corrected the link replacement logic for robustness */}
                        <a href={props.link.replace("x.com", "twitter.com")}>Loading Tweet...</a>
                        </blockquote>
                        }


                    </div>
            </div>
        </div>
}