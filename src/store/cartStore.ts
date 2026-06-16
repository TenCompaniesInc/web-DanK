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
  addToCart: (product: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, qty: 1 }] };
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

  totalItems: () => get().cart.reduce((sum, item) => sum + item.qty, 0),
  totalPrice: () => get().cart.reduce((sum, item) => sum + item.price * item.qty, 0),
}));