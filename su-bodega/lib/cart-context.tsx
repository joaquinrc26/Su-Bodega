'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  year: number;
  stock?: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hidratar desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem('su-bodega-cart');
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
    setHydrated(true);
  }, []);

  // Guardar en localStorage cuando el carrito cambie
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('su-bodega-cart', JSON.stringify(cart));
    }
  }, [cart, hydrated]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === newItem.id);
      const stock = Number(newItem.stock ?? 0);
      const requestedQuantity = Number(newItem.quantity || 1);

      if (existing) {
        const nextQuantity = existing.quantity + requestedQuantity;
        const safeQuantity = stock > 0 ? Math.min(nextQuantity, stock) : 0;
        return prevCart.map((item) =>
          item.id === newItem.id ? { ...item, quantity: safeQuantity } : item
        );
      }

      const safeQuantity = stock > 0 ? Math.min(requestedQuantity, stock) : 0;
      return safeQuantity > 0 ? [...prevCart, { ...newItem, quantity: safeQuantity }] : prevCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== id) return item;
        const maxQuantity = Number(item.stock ?? 0);
        return { ...item, quantity: maxQuantity > 0 ? Math.min(quantity, maxQuantity) : 0 };
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
