

import { CrossIcon } from "../../icons/cross";
import { ShareIcon } from "../../icons/share";

// this is new
interface CardProps {
    title: string;
    link: string;
    type: "Youtube" | "Twitter" | string;
    onDelete: (title: string) => void;
}

const defaultStyles = "p-8 bg-white rounded-md shadow-md border-gray-100 max-w-96 border";
const foricons = "text-grey-500";

export const Card: React.FC<CardProps> = (props) => {

    
    const handleDeleteClick = () => {
        props.onDelete(props.title);
    };
    
    return (
        <div>
            <div className={`${defaultStyles}`}>
                <div className="flex justify-between">
                    <div className="flex items-center text-md"> 
                        <div className="text-grey-500 pr-2"><ShareIcon size="md"/></div>
                        {props.title}
                    </div>    
                    <div className="flex items-center">
                        <div className={`pr-2 ${foricons}`}>
                            <a href={props.link} target="_blank" rel="noopener noreferrer">
                                <ShareIcon size="md"/> 
                            </a>
                        </div>
                        <div className={`pr-2 ${foricons} cursor-pointer`} onClick={handleDeleteClick}>
                            <CrossIcon size="md2"/> 
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    {/* for video */}
                    {props.type == "Youtube" && 
                    <iframe className="w-full rounded-md"
                        src={props.link.replace("watch?v=", "embed/")} 
                        title="Youtube Video Player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
                    </iframe>
                    }

                    {/* for tweet */}
                    {props.type == "Twitter" &&  
                    <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
                        <a href={props.link.replace("x.com", "twitter.com")}>Loading Tweet...</a>
                    </blockquote>
                    }

                    {/* {for other things} */}
                    {props.type !== 'Youtube' && props.type !== 'Twitter' && (
                         <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-sm font-semibold text-gray-600">Link:</p>
                            <a href={props.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">
                                {props.link}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

