export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price).replace('US$', '$');
};
