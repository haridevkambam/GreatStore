import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response.data.message || "An error occurred in fetching cart items");
        }
    },

    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId : product._id }); 
            toast.success("Added to cart", {id : 'added'});

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem ? prevState.cart.map((item) => (
                    item._id === product._id ? {...item, quantity : item.quantity + 1} : item
                )) : [...prevState.cart, {...product, quantity : 1}];
                return { cart: newCart };
            });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred in adding to cart");
        }
    },

    calculateTotals: async () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = coupon ? subtotal - (subtotal * coupon.discount / 100) : subtotal;
        set({ subtotal, total });
    }
}))
