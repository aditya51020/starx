export const formatPrice = (price) => {
    if (price === undefined || price === null) return '';
    const numPrice = Number(price);
    if (isNaN(numPrice)) return price;

    if (numPrice >= 10000000) {
        return `₹${(numPrice / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
    } else if (numPrice >= 100000) {
        return `₹${(numPrice / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lac`;
    } else if (numPrice >= 1000) {
        return `₹${(numPrice / 1000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Th`;
    } else {
        return `₹${numPrice.toLocaleString('en-IN')}`;
    }
};
