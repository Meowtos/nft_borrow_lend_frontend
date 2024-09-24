import { project } from "@/utils/constants";
import { Body } from "./Body";
export const metadata = {
    title: `Offers - ${project}`,
    description: "Offers Received on Listed Assets"
}
export default function Page(){
    return <Body />
}