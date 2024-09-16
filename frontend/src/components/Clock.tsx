"use client"

import { getDurationLeft } from "@/utils/time";
import { useEffect, useState } from "react";

export function Clock({ timestamp }: { timestamp: number }){
    const [timeLeft, setTimeLeft] = useState(getDurationLeft(timestamp));
    useEffect(()=>{
        const timeInterval = setInterval(()=>{
            const settleEndTime = getDurationLeft(timestamp)
            setTimeLeft(settleEndTime)
        }, 1000)
        return () => clearInterval(timeInterval); 
    },[timestamp])

    return timeLeft
}