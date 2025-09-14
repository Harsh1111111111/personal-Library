export function SidebarItem({text, icon} :
    {
        text : string, 
        icon : React.ReactElement
    })
{
    return <div className="flex items-center text-gray-700 gap-x-3 p-3 cursor-pointer hover:bg-gray-200 rounded w-full transition-all duration-250">
        <div>
        {icon}
        </div>
        <div>
        {text}
        </div>
    </div>
}