import { useAuthUser } from './useAuthUser';
import type { AuthUserFragmentResponse } from '../graphql/fragments';

// export const useAmountInCart = (productId: number, authUser: AuthUserFragmentResponse) => {
export const useAmountInCart = (productId: number, isAuthUser: boolean, authUser: AuthUserFragmentResponse|null|undefined) => {
  // if(isAuthUser) {
      // const { authUser } = useAuthUser();
      // console.log(authUser);
    
      const order = authUser?.orders.find((order) => order.isOrdered === false);
      const shoppingCartItems = order?.items ?? [];
      const amountInCart = shoppingCartItems.find((item) => item.product.id === productId)?.amount ?? 0;

      return { amountInCart };
  // }
  // const amountInCart = 0;
  // return { amountInCart };

};
