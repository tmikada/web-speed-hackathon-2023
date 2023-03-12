import type { FC } from 'react';
import { lazy, Suspense } from 'react';
import * as Router from 'react-router-dom';

// import { NotFound } from '../../../pages/NotFound';
const NotFound = lazy(() => import('../../../pages/NotFound')
    .then(({ NotFound }) => ({ default: NotFound })));
// import { Order } from '../../../pages/Order';
const Order = lazy(() => import('../../../pages/Order')
    .then(({ Order }) => ({ default: Order })));
// import { OrderComplete } from '../../../pages/OrderComplete';
const OrderComplete = lazy(() => import('../../../pages/OrderComplete')
    .then(({ OrderComplete }) => ({ default: OrderComplete })));
// import { ProductDetail } from '../../../pages/ProductDetail';
const ProductDetail = lazy(() => import('../../../pages/ProductDetail')
    .then(({ ProductDetail }) => ({ default: ProductDetail })));
import { Top } from '../../../pages/Top';

import { useScrollToTop } from './hooks';

export const Routes: FC = () => {
  useScrollToTop();

  return (
    <Router.Routes>
      <Router.Route element={<Top />} path="/" />
      <Router.Route element={<ProductDetail />} path="/product/:productId" />
      <Router.Route element={<Order />} path="/order" />
      <Router.Route element={<OrderComplete />} path="/order/complete" />
      <Router.Route element={<NotFound />} path="*" />
    </Router.Routes>
  );
};
