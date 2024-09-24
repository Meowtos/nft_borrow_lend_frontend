import { project } from "@/utils/constants"
import { Body } from "./Body"
export const metadata = {
    title: `Assets - ${project}`,
    description: "Borrow Loans on your assets"
}
export default function Page() {
    return (
        <Body />
    )
}