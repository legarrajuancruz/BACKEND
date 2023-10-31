export const generateProductsErrorInfo = (producto) => {
  return `Una o mas propiedades fueron enviadas incompletas o no son validas
        Lista de propiedades:
            --> title: type String, recibido: ${producto.title}
            --> price: type Number, recibido: ${producto.price}
            --> stock: type Number, recibido: ${producto.stock}
        `;
};
