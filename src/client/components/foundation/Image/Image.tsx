import classNames from 'classnames';
import type { ComponentProps, FC } from 'react';

import * as styles from './Image.styles';

type Props = Omit<ComponentProps<'img'>, 'className'> & {
  fill?: boolean;
};

export const Image: FC<Props> = ({ fill, ...rest }) => {
  // console.log(rest);
  // if(rest.src?.endsWith('.jpg')) { rest.src = rest.src.substring(0,rest.src.length-4)+".webp" };
  return (
    <img
      className={classNames(styles.container(), {
        [styles.container__fill()]: fill === true,
      })}
      loading="lazy"
      {...rest}
    />
  );
};
