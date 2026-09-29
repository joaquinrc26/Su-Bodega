import { redirect } from 'next/navigation';

export default function CheckoutLayout() {
  redirect('/cart');
}