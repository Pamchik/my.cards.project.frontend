export function funcNumberWithThousandSeparator (number: number) {
    return number
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
};