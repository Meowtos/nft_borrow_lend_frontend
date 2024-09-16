import dayjs from "dayjs"
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
export const secInADay = 24 * 60 * 60;
export const getDurationLeft = (endTime: number) => {
    const remainingTime = endTime - dayjs().unix(); // Calculate the remaining time until endTime
    if (remainingTime <= 0) {
        return '00h:00m:00s'; // If the remaining time is less than or equal to 0, return zero duration
    }

    const duration = dayjs.duration(remainingTime * 1000); // Convert seconds to milliseconds for dayjs duration

    return `${Math.floor(duration.asHours())}h:${duration.minutes()}m:${duration.seconds()}s`;
};