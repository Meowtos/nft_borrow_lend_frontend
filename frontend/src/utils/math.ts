export function interestAmount(apr: number, amount: number, duration: number) {
    const interestInDuration = interestPercentage(apr, duration);
    return amount * interestInDuration/100;
}

export function interestPercentage(apr: number, duration: number){
    const interestPerDay = apr / 365;
    return duration * interestPerDay;
}

export function repayAmountWithInterest(apr: number, amount: number, duration: number){
    return amount + interestAmount(apr, amount, duration)
}