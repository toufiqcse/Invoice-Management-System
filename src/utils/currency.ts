

  // src/utils/currency.ts

export const currencyOptions = [
    { code: "USD", label: "USD - $" },
    { code: "EUR", label: "EUR - €" },
    { code: "BDT", label: "BDT - ৳" },
    { code: "INR", label: "INR - ₹" },
    { code: "GBP", label: "GBP - £" },
    // Add more currencies as needed
  ];
  
//   export const currencySymbols: Record<string, string> = {
//     USD: "$",
//     EUR: "€",
//     BDT: "৳",
//     INR: "₹",
//     GBP: "£",
//   };
  
//   export const getCurrencySymbol = (code: string): string =>
//     currencySymbols[code] || code;
export const getCurrencySymbol = (code: string): string => {
    switch (code) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "BDT":
        return "৳";
      case "GBP":
        return "£";
      case "INR":
        return "₹";
      default:
        return "$";
    }
  };