import { css } from '@emotion/css';

export const container = ({ clientHeight, ratioWidth, ratioHeight }: { clientHeight: number | undefined, ratioWidth: number, ratioHeight: number }) => css`
  // height: ${clientHeight ?? 0}px;
  position: relative;
  width: 100%;
  aspect-ratio: ${ratioWidth}/${ratioHeight};
`;
