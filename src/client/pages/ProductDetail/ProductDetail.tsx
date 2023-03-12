import type { FC } from 'react';
import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

// import { Layout } from '../../components/application/Layout';
const Layout = lazy(() => import('../../components/application/Layout')
    .then(({ Layout }) => ({ default: Layout })));
// import { WidthRestriction } from '../../components/foundation/WidthRestriction';
const WidthRestriction = lazy(() => import('../../components/foundation/WidthRestriction')
    .then(({ WidthRestriction }) => ({ default: WidthRestriction })));
// import { ProductMediaListPreviewer } from '../../components/product/ProductMediaListPreviewer';
const ProductMediaListPreviewer = lazy(() => import('../../components/product/ProductMediaListPreviewer')
    .then(({ ProductMediaListPreviewer }) => ({ default: ProductMediaListPreviewer })));
// import { ProductOverview } from '../../components/product/ProductOverview';
const ProductOverview = lazy(() => import('../../components/product/ProductOverview')
    .then(({ ProductOverview }) => ({ default: ProductOverview })));
// import { ProductPurchaseSection } from '../../components/product/ProductPurchaseSeciton';
const ProductPurchaseSection = lazy(() => import('../../components/product/ProductPurchaseSeciton')
    .then(({ ProductPurchaseSection }) => ({ default: ProductPurchaseSection })));
// import { ReviewSection } from '../../components/review/ReviewSection';
const ReviewSection = lazy(() => import('../../components/review/ReviewSection')
    .then(({ ReviewSection }) => ({ default: ReviewSection })));
import { useActiveOffer } from '../../hooks/useActiveOffer';
import { useAmountInCart } from '../../hooks/useAmountInCart';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useProduct } from '../../hooks/useProduct';
import { useReviews } from '../../hooks/useReviews';
import { useSendReview } from '../../hooks/useSendReview';
import { useUpdateCartItem } from '../../hooks/useUpdateCartItems';
import { useOpenModal } from '../../store/modal';
import { normalizeCartItemCount } from '../../utils/normalize_cart_item';

import * as styles from './ProductDetail.styles';

export const ProductDetail: FC = () => {
  const { productId } = useParams();

  const { product } = useProduct(Number(productId));
  const { reviews } = useReviews(product?.id);
  const { authUser,isAuthUser } = useAuthUser();
  // console.log(isAuthUser,authUser);
  const { sendReview } = useSendReview();
  const { updateCartItem } = useUpdateCartItem();
  const handleOpenModal = useOpenModal();
  const { amountInCart } = useAmountInCart(Number(productId), Boolean(isAuthUser), authUser);// このなかでuseAuthUser呼び出している
  const { activeOffer } = useActiveOffer(product);

  const handleSubmitReview = ({ comment }: { comment: string }) => {
    sendReview({
      variables: {
        comment,
        productId: Number(productId),
      },
    });
  };

  const handleUpdateItem = (productId: number, amount: number) => {
    updateCartItem({
      variables: { amount: normalizeCartItemCount(amount), productId },
    });
  };

  return (
    <>
      {product && (
        <Helmet>
          <title>{product.name}</title>
        </Helmet>
      )}
      <Layout>
        <WidthRestriction>
          <div className={styles.container()}>
            <section className={styles.details()}>
              <ProductMediaListPreviewer product={product} />
              <div className={styles.overview()}>
                <ProductOverview activeOffer={activeOffer} product={product} />
              </div>
              <div className={styles.purchase()}>
                <ProductPurchaseSection
                  amountInCart={amountInCart}
                  isAuthUser={isAuthUser}
                  onOpenSignInModal={() => handleOpenModal('SIGN_IN')}
                  onUpdateCartItem={handleUpdateItem}
                  product={product}
                />
              </div>
            </section>

            <section className={styles.reviews()}>
              <h2 className={styles.reviewsHeading()}>レビュー</h2>
              <ReviewSection hasSignedIn={isAuthUser} onSubmitReview={handleSubmitReview} reviews={reviews} />
            </section>
          </div>
        </WidthRestriction>
      </Layout>
    </>
  );
};
