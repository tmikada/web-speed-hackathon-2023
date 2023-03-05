import { useFormik } from 'formik';
// import _ from 'lodash';
import type { ChangeEventHandler, FC } from 'react';
// import zipcodeJa from 'zipcode-ja';
import { useState, useEffect } from 'react';
import { PrimaryButton } from '../../foundation/PrimaryButton';
import { TextInput } from '../../foundation/TextInput';

import * as styles from './OrderForm.styles';

type OrderFormValue = {
  zipCode: string;
  prefecture: string;
  city: string;
  streetAddress: string;
};

type Props = {
  onSubmit: (orderFormValue: OrderFormValue) => void;
};

export const OrderForm: FC<Props> = ({ onSubmit }) => {
  const formik = useFormik<OrderFormValue>({
    initialValues: {
      city: '',
      prefecture: '',
      streetAddress: '',
      zipCode: '',
    },
    onSubmit,
  });

  // const [zipcodeJa, setZipcodeJa] = useState<Record<string, any>>({});

  // useEffect(() => {
  //   import('zipcode-ja').then((module) => {
  //     setZipcodeJa(module.default);
  //   });
  // }, []);

  const [loading, setLoading] = useState(false);

  const handleZipcodeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    formik.handleChange(event);
  
    const zipCode = event.target.value;
    if(zipCode.length != 7) return;
    const url = `https://api.zipaddress.net/?zipcode=${zipCode}`;

    setLoading(true);
    
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        setLoading(false);
        if (data.code === 200) {
          const prefecture = data.data.pref;
          const city = data.data.city + data.data.town;
          formik.setFieldValue('prefecture', prefecture);
          formik.setFieldValue('city', city);
        }
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };
  // const handleZipcodeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
  //   formik.handleChange(event);

  //   const zipCode = event.target.value;
  //   // const address = [...(_.cloneDeep(zipcodeJa)[zipCode]?.address ?? [])];
  //   const address = [...(zipcodeJa[zipCode]?.address ?? [])];
  //   const prefecture = address.shift();
  //   const city = address.join(' ');

  //   formik.setFieldValue('prefecture', prefecture);
  //   formik.setFieldValue('city', city);
  // };

  return (
    <div className={styles.container()}>
      <form className={styles.form()} data-testid="order-form" onSubmit={formik.handleSubmit}>
        <div className={styles.inputList()}>
          <TextInput
            required
            id="zipCode"
            label="郵便番号"
            onChange={handleZipcodeChange}
            placeholder="例: 1500042"
            value={formik.values.zipCode}
          />
          <TextInput
            required
            id="prefecture"
            label="都道府県"
            onChange={formik.handleChange}
            placeholder="例: 東京都"
            value={formik.values.prefecture}
          />
          <TextInput
            required
            id="city"
            label="市区町村"
            onChange={formik.handleChange}
            placeholder="例: 渋谷区宇田川町"
            value={formik.values.city}
          />
          <TextInput
            required
            id="streetAddress"
            label="番地・建物名など"
            onChange={formik.handleChange}
            placeholder="例: 40番1号 Abema Towers"
            value={formik.values.streetAddress}
          />
        </div>
        <div className={styles.purchaseButton()}>
          <PrimaryButton size="lg" type="submit" disabled={loading}>
            {loading ? '処理中...' : '購入'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
