// composables/useFormatPrice.js
function formatPrice(price) {
    return new Intl.NumberFormat().format(price);
  }
  
  export { formatPrice };
  