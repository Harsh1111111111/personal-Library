import { BrainIcon } from "../../icons/brain";
import { Twitter } from "../../icons/twitter";
import {Youtube} from "../../icons/youtube";
import { SidebarItem } from "./SidebarItem";

export const Sidebar = () =>{
    return <div className="h-screen bg-white w-7 fixed position-f">
        <div className="flex p-2 text-2xl items-center gap-x-2">
            <div className="text-[#5046e4] flex"><BrainIcon size = "lg"/> </div>
            Brainly
        </div>
        <div className="pl-3 h-screen bg-white w-72 fixed">
        <SidebarItem text ="Twitter" icon = {<Twitter size = "md"/>} />
         <SidebarItem text ="Youtube" icon = {<Youtube size = "md"/>} />
         </div>
    </div>
}