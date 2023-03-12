import type { FC } from 'react';
import { useEffect, useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';

// import { Layout } from '../../components/application/Layout';
const Layout = lazy(() => import('../../components/application/Layout')
    .then(({ Layout }) => ({ default: Layout })));
import { loadFonts } from '../../utils/load_fonts';

import * as styles from './NotFound.styles';

export const NotFound: FC = () => {
  // const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadFonts(); // 読み込み終わりまで待たない
    // const load = async () => {
    //   await loadFonts();
    //   // setIsReady(true);
    // };

    // load();
  }, []);

  // if (!isReady) {
  //   return  <div>Loading...</div>;
  //   // return  null;
  // }

  return (
    <>
      <Helmet>
        <title>ページが見つかりませんでした</title>
      </Helmet>
      <Layout>
        <div className={styles.container()}>
          <div className={styles.inner()}>
            <p className={styles.mainParagraph()}>ページが存在しません</p>
            <p className={styles.subParagraph()}>Not Found</p>
          </div>
        </div>
      </Layout>
    </>
  );
};
