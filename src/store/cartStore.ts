import { create } from 'zustand';

type CartItem = {
  id: number;
  name: string;
  price: number;
  weight: string;
  image: string;
  qty: number;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  addToCart: (product) => set((state) => {
    const startQty = product.qty && product.qty > 0 ? product.qty : 1;
    const existing = state.cart.find(item => item.id === product.id && item.weight === product.weight);
    if (existing) {
      return {
        cart: state.cart.map(item =>
          item.id === product.id && item.weight === product.weight
            ? { ...item, qty: item.qty + startQty }
            : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, qty: startQty }] };
  }),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(item => item.id !== id)
  })),

  updateQuantity: (id, qty) => set((state) => ({
    cart: state.cart.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, qty) } : item
    )
  })),

  clearCart: () => set({ cart: [] }),

  // Number of distinct product lines in the cart, NOT the summed kg/qty.
  // Selecting one product = 1 item badge, regardless of how many kg/units chosen.
  totalItems: () => get().cart.length,

  totalPrice: () => get().cart.reduce((sum, item) => sum + item.price * item.qty, 0),
}));
 