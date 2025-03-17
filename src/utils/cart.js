import { toast } from 'react-toastify';

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
     * @param {json} variant selected variant
     * @param {json} size selected size
     */
    addCartWithQuantity(product, quantity, variant, size) {
        const id = `${product._id}-${variant.color._id}-${size.size._id}`;
        let newProduct = {
            productInfo: product,
            quantity: 0,
            price: product.p_promotion > 0 ? product.p_promotion : product.p_price,
            variant: variant,
            size: size // added size to the product in cart
        };

        if (this.products[id]) {
            newProduct.quantity = this.products[id].quantity;
        }

        if (size.stock < newProduct.quantity + quantity) {
            toast.error('Số lượng sản phẩm không đủ');
            return false;
        }

        newProduct.quantity += quantity;
        this.products[id] = newProduct;
        this.totalPrice += quantity * (product.p_promotion > 0 ? product.p_promotion : product.p_price);
        this.totalPriceDiscount += quantity * (product.p_price - product.p_promotion);
        this.totalQuantity += quantity;

        return true;
    }

    /**
     * remove product from cart
     * @param {string} product_id 
     * @param {string} variant_id 
     * @param {string} size_id 
     */
    removeItemCart(product_id, variant_id, size_id) {
        const id = `${product_id}-${variant_id}-${size_id}`; // include size in id
        this.totalQuantity -= this.products[id].quantity;
        this.totalPrice -= this.products[id].price;
        this.totalPriceDiscount -= this.products[id].quantity * (this.products[id].productInfo.p_price - this.products[id].productInfo.p_promotion);

        delete this.products[id];
    }

    updateCartById(product_id, variant_id, quantity, size_id) {
        const id = `${product_id}-${variant_id}-${size_id}`; // include size in id
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

// module.exports = Cart;

export default Cart;