import Image from "next/image";

export function Loading(){
    return(
        <Image src="/media/loading.gif" alt="loading" height={200} width={200}/>
    )
}