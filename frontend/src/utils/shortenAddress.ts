export function shortenAddress(address: string, startChars: number = 4, endChars: number = 4) {
    if (address.length <= startChars + endChars) {
        return address
    }
    const start = address.substring(0, startChars)
    const end = address.substring(address.length - endChars)
    return `${start}...${end}`
}