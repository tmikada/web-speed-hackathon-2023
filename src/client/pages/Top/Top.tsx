import type { FC } from 'react';
import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';

import { Layout } from '../../components/application/Layout';
import { ProductList } from '../../components/feature/ProductList';
import { ProductHeroImage } from '../../components/product/ProductHeroImage';
import { useFeatures } from '../../hooks/useFeatures';
import { useRecommendation } from '../../hooks/useRecommendation';
// const Layout = lazy(() => import('../../components/application/Layout')
//     .then(({ Layout }) => ({ default: Layout })));
// const ProductList = lazy(() => import('../../components/feature/ProductList')
//     .then(({ ProductList }) => ({ default: ProductList })));
// const ProductHeroImage = lazy(() => import('../../components/product/ProductHeroImage')
//     .then(({ ProductHeroImage }) => ({ default: ProductHeroImage })));

import * as styles from './Top.styles';

export const Top: FC = () => {
  const { recommendation } = useRecommendation();
  const { features } = useFeatures();

  // if (recommendation === undefined || features === undefined) {
  //   return  <><Layout><div>Loading...</div></Layout></>;
  // }

  return (
    <>
      <Helmet>
        <title>買えるオーガニック</title>
      </Helmet>
      <Suspense fallback={<div>Loading...</div>}>
        <Layout>
          <div>
            {recommendation?.product && (
            <ProductHeroImage product={recommendation.product} title="今週のオススメ" />
            )}

            <div className={styles.featureList()}>
              {features.map((featureSection) => {
                return (
                  <div key={featureSection.id} className={styles.feature()}>
                    <h2 className={styles.featureHeading()}>{featureSection.title}</h2>
                    <ProductList featureSection={featureSection} />
                  </div>
                );
              })}
            </div>
          </div>
        </Layout>
      </Suspense>
    </>
  );
};
