import { project } from "@/utils/constants";
import { Body } from "./Body";
export const metadata = {
    title: `Keyless Login - ${project}`,
    description: "Aptos keyless login redirect page"
}
export default function Page(){
    return(
        <Body />
    )
}