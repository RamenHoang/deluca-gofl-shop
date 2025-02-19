class Cart {
    products = {};
    totalPrice = 0;
    totalPriceDiscount = 0;
    totalQuantity = 0;

    constructor(oldCart) {
        if (oldCart) {
            this.products = oldCart.products;
            this.totalPrice = oldCart.totalPrice;
            this.totalQuantity = oldCart.totalQuantity;
            this.totalPriceDiscount = oldCart.totalPriceDiscount;
        }
    }

    /**
     * add single product into cart
     * @param {json} product product info
     * @param {string} id productID
     */
    addCart(product, id) {
        let newProduct = { productInfo: product, quantity: 0, price: product.p_promotion };

        if (this.products[id]) {
            newProduct = this.products[id];
        }

        newProduct.quantity++;
        newProduct.price = product.p_promotion * newProduct.quantity;

        this.products[id] = newProduct;
        this.totalPrice += product.p_promotion;
        this.totalPriceDiscount += (product.p_price - product.p_promotion);
        this.totalQuantity++;
    }
    
    /**
     * add multi product into cart
     * @param {json} product productInfo
     * @param {string} id productId
     * @param {number} quantity quantity of product want to add cart
     */
    addCartWithQuantity (product, id, quantity) {
        let newProduct = { productInfo: product, quantity: 0, price: product.p_promotion };

        if (this.products[id]) {
            newProduct = this.products[id];
        }

        newProduct.quantity += quantity;
        newProduct.price = product.p_promotion * newProduct.quantity;

        this.products[id] = newProduct;
        this.totalPrice += quantity * (product.p_promotion);
        this.totalPriceDiscount += quantity * (product.p_price - product.p_promotion);
        this.totalQuantity += quantity;
    }

    /**
     * remove product from cart
     * @param {string} id 
     */
    removeItemCart (id) {
        this.totalQuantity -= this.products[id].quantity;
        this.totalPrice -= this.products[id].price;
        this.totalPriceDiscount -= this.products[id].quantity * (this.products[id].productInfo.p_price - this.products[id].productInfo.p_promotion);

        delete this.products[id];
    }

    updateCartById (id, quantity) {
        this.totalQuantity -= this.products[id].quantity;
        this.totalPrice -= this.products[id].price;
        this.totalPriceDiscount -= this.products[id].quantity * (this.products[id].productInfo.p_price - this.products[id].productInfo.p_promotion);

        this.products[id].quantity = quantity;
        this.products[id].price = quantity * this.products[id].productInfo.p_promotion;

        this.totalPrice += this.products[id].price;
        this.totalPriceDiscount += this.products[id].quantity * (this.products[id].productInfo.p_price - this.products[id].productInfo.p_promotion);
        this.totalQuantity += this.products[id].quantity;

    }
}

module.exports = Cart;