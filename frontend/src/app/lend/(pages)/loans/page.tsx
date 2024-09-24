// lend/loans (Loans given)
import { project } from "@/utils/constants"
import { Body } from "./Body"
export const metadata = {
    title: `Loans - ${project}`,
    description: "Loans Given on assets"
}
export default function Page(){
    return(
        <Body />
    )
}