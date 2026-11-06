export const getServiceDebt = (price: number | string, paidAmount: number | string | null | undefined) => {
    const priceValue = Number(price) || 0;
    const paidValue = Number(paidAmount) || 0;
    return Math.max(priceValue - paidValue, 0);
};
