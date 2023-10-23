export function formatCurrency(input) {
    const numericValue = parseFloat(input);
    if (isNaN(numericValue)) {
        throw new Error('Invalid input');
    }
    const formattedCurrency = numericValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });

    return formattedCurrency;
}