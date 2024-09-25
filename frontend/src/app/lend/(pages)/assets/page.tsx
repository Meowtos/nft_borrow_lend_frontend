// lend/assets (Give a new loan)
import { project } from "@/utils/constants";
import { Body } from "./Body";

export const metadata = {
    title: `Assets - ${project}`,
    description: "Give Loans on assets"
}
export default async function Page(){
    return <Body />

}