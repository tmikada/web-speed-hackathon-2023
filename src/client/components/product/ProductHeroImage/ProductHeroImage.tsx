// import CanvasKitInit from 'canvaskit-wasm';
// import CanvasKitInit from 'canvaskit-wasm/bin/canvaskit.js';
// import CanvasKitWasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url';
// import CanvasKitWasmUrl from 'canvaskit-wasm/bin/canvaskit.js';
import classNames from 'classnames';
// import _ from 'lodash';
import { memo, useEffect, useState } from 'react';
import type { FC } from 'react';

import type { ProductFragmentResponse } from '../../../graphql/fragments';
import { Anchor } from '../../foundation/Anchor';
import { AspectRatio } from '../../foundation/AspectRatio';
import { DeviceType, GetDeviceType } from '../../foundation/GetDeviceType';
import { WidthRestriction } from '../../foundation/WidthRestriction';

import * as styles from './ProductHeroImage.styles';

async function loadImageAsDataURL(url: string): Promise<string> {
  // const CanvasKit = await CanvasKitInit({
  //   // WASM ファイルの URL を渡す
  //   locateFile: () => CanvasKitWasmUrl,
  // });

  // // 画像を読み込む
  // const data = await fetch(url).then((res) => res.arrayBuffer());
  // const image = CanvasKit.MakeImageFromEncoded(data);
  
  // if (image == null) {
  //   // 読み込みに失敗したとき、透明な 1x1 GIF の Data URL を返却する
  //   return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  // }

  // // 画像を Canvas に描画して Data URL を生成する
  // // const canvas = CanvasKit.MakeCanvas(image.width(), image.height());

  // const ctx = canvas.getContext('2d');
  // // @ts-expect-error ...
  // ctx?.drawImage(image, 0, 0);
  // return canvas.toDataURL();

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d')?.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };
    img.onerror = (e) => {
      console.error(e);
      reject(e);
    };
    img.src = url;
  });  
}

type Props = {
  product: ProductFragmentResponse;
  title: string;
};

export const ProductHeroImage: FC<Props> = memo(({ product, title }) => {
  let thumbnailFile = product.media.find((productMedia) => productMedia.isThumbnail)?.file;

  let [imageDataUrl, setImageDataUrl] = useState<string>();

  useEffect(() => {
    if (thumbnailFile == null) {
      // ここでサムネ表示する処理をいれる？
      return;
    }
    // if(thumbnailFile.filename.endsWith('.jpg')) {
    //    thumbnailFile.filename = thumbnailFile.filename.substring(0,thumbnailFile.filename.length-4)+".webp" 
    //   };
    loadImageAsDataURL(thumbnailFile.filename).then((dataUrl) => setImageDataUrl(dataUrl));
  }, [thumbnailFile]);

  // if (imageDataUrl === undefined) {
  //   return null;
  // }
  // if(imageDataUrl.endsWith('.jpg')) { imageDataUrl = imageDataUrl.substring(0,imageDataUrl.length-4)+".webp" };

  return (
    <GetDeviceType>
      {({ deviceType }) => {
        return (
          <WidthRestriction>
            <Anchor href={`/product/${product.id}`}>
              <div className={styles.container()}>
                <AspectRatio ratioHeight={9} ratioWidth={16}>
                  <img className={styles.image()} src={imageDataUrl} />
                </AspectRatio>

                <div className={styles.overlay()}>
                  <p
                    className={classNames(styles.title(), {
                      [styles.title__desktop()]: deviceType === DeviceType.DESKTOP,
                      [styles.title__mobile()]: deviceType === DeviceType.MOBILE,
                    })}
                  >
                    {title}
                  </p>
                  <p
                    className={classNames(styles.description(), {
                      [styles.description__desktop()]: deviceType === DeviceType.DESKTOP,
                      [styles.description__mobile()]: deviceType === DeviceType.MOBILE,
                    })}
                  >
                    {product.name}
                  </p>
                </div>
              </div>
            </Anchor>
          </WidthRestriction>
        );
      }}
    </GetDeviceType>
  );
});


ProductHeroImage.displayName = 'ProductHeroImage';
