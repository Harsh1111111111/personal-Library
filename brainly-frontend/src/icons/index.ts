export interface IconProps
{
    size : "sm" | "md" | "lg" | "md2";
    onclick ?: ()=>void
}

export const iconSizeVariant =
{
    "sm" : "size-2",
    "md" : "size-4",
    "md2" : "size-5",
    "lg" : "size-6",

}