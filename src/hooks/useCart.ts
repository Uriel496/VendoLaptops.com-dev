import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/store/cartStore';

/**
 * Hook personalizado que wrappea useCartStore con selectores individuales
 * para evitar re-renders innecesarios en los componentes.
 */
export const useCart = () => {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  // Calcular el número total de items en el carrito
  const itemCount = useCartStore((state) => 
    state.cart.reduce((total, item) => total + item.quantity, 0)
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    itemCount,
  };
};

// Export type para mantener compatibilidad
export type { CartItem };
