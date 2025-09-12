

interface ButtonProps
{
    variant :  "primary" | "secondary";
    size : "sm" | "md" | "lg";
    text : string;
    startIcon?: any; 
    endIcon?: any; 
    onClick?: () => void ;


}

const variantStyles = {
    "primary" : "bg-[#5046e4] text-white",
    "secondary" : "bg-[#e0e7fe] text-[#5046e4]" 

}

const sizeStyle ={
    sm: "py-1 px-2 text-sm", // Added text-sm for consistency
    md: "py-2 px-4",
    lg: "py-4 px-6 text-lg",
}

const defaultStyles = "rounded-md flex  items-center cursor-pointer"

export const Button  = (props : ButtonProps) =>{


    return <button onClick={props.onClick} className={`${variantStyles[props.variant]} ${defaultStyles} ${sizeStyle[props.size]} ` }>
        {props.startIcon ? <div className= "pr-2">{props.startIcon}</div> : null} 
        {props.text}
        {props.endIcon ? <div className = "pl-2">{props.endIcon}</div> : null}

        </button>
}


