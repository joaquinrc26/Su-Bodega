'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  year: number;
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
      if (existing) {
        return prevCart.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        );
      }
      return [...prevCart, { ...newItem, quantity: newItem.quantity || 1 }];
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
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
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
