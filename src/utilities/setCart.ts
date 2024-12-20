import { Cart } from '@/app/(frontend)/(unauthorized)/add-to-cart/page'
import { setCookie } from 'cookies-next';
 
export async function createCart(cart: Cart) {
  await setCookie('cart', JSON.stringify(cart), {
        path: '/',
      });
}