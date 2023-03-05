import { useEffect, useState } from 'react';

import type { LimitedTimeOfferFragmentResponse, ProductFragmentResponse } from '../graphql/fragments';
import { getActiveOffer } from '../utils/get_active_offer';

export function useActiveOffer(product: ProductFragmentResponse | undefined) {
  const [activeOffer, setActiveOffer] = useState<LimitedTimeOfferFragmentResponse | undefined>(undefined);

  useEffect(() => {
      if (!product) {
        setActiveOffer(undefined);
        return;
      }
      const offer = getActiveOffer(product.offers);
      setActiveOffer(offer);
  
      const handleResize = () => {
        const newOffer = getActiveOffer(product.offers);
        setActiveOffer(newOffer);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [product]);

      //   const timer = setInterval(() => {
  //     if (!product) {
  //       setActiveOffer(undefined);
  //       return;
  //     }

  //     const offer = getActiveOffer(product.offers);
  //     setActiveOffer(offer);
  //   }, 0);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [product]);

  return { activeOffer };
}
