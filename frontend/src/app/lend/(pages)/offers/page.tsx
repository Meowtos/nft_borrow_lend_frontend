// lend/offers (Offers given)
import { project } from "@/utils/constants";
import { Body } from "./Body";
export const metadata = {
    title: `Offers - ${project}`,
    description: "Offers given on assets"
}
export default function Page(){
    return <Body />
}