import { project } from "@/utils/constants"
import { Body } from "./Body"
export const metadata = {
    title: `Loans - ${project}`,
    description: "Loans Borrowed on assets"
}
export default function Page(){
    return <Body />
}