export const formatPhoneNumber = (value: string) => {
  // Remove all non-digit characters
  let numbers = value.replace(/\D/g, '');
  
  // If it starts with 998, keep it, otherwise prepend it if there's at least one digit
  if (numbers.length > 0 && !numbers.startsWith('998')) {
    numbers = '998' + numbers;
  }
  
  // Limit to 12 digits (998 + 9 digits)
  numbers = numbers.slice(0, 12);
  
  let formatted = '+998';
  
  // Format: +998 XX XXX XX XX
  if (numbers.length > 3) {
    formatted += ' ' + numbers.slice(3, 5);
  }
  if (numbers.length > 5) {
    formatted += ' ' + numbers.slice(5, 8);
  }
  if (numbers.length > 8) {
    formatted += ' ' + numbers.slice(8, 10);
  }
  if (numbers.length > 10) {
    formatted += ' ' + numbers.slice(10, 12);
  }
  
  return formatted;
};
