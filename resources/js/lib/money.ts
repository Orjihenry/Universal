export function formatMoney(amount: string | number): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    }).format(Number(amount));
}
