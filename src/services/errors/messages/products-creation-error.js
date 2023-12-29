export const generateProductsErrorInfo = (producto) => {
  return `Una o mas propiedades fueron enviadas incompletas o no son validas
        Lista de propiedades:
            --> title: type String, recibido: ${producto.title}
            --> price: type Number, recibido: ${producto.price}
            --> stock: type Number, recibido: ${producto.stock}
        `;
};

export const eliminateProductsErrorInfo = (_id) => {
  return `Una o mas propiedades fueron enviadas incompletas o no no coinciden con el _id
          Lista de propiedades del producto:
                    --> Object._id: type String, recibido: ${_id}
          `;
};

export const getProductByIdErrorInfo = (_id) => {
  return `Una o mas propiedades fueron enviadas incompletas o no no coinciden con el _id
            Lista de propiedades del producto:
                    --> Object._id: type String, recibido: ${_id}
            `;
};
