import type { ReactNode } from 'react';
import { Component } from 'react';
import { useState, useEffect } from 'react';

export const DeviceType = {
  DESKTOP: 'DESKTOP',
  MOBILE: 'MOBILE',
} as const;
export type DeviceType = typeof DeviceType[keyof typeof DeviceType];

type Props = {
  children: ({ deviceType }: { deviceType: DeviceType }) => ReactNode;
};

export const GetDeviceType = ({ children: render }: Props) => {
  const [deviceType, setDeviceType] = useState<DeviceType>(
    window.innerWidth >= 1024 ? DeviceType.DESKTOP : DeviceType.MOBILE
  );

  const handleResize = () => {
    const newDeviceType = window.innerWidth >= 1024 ? DeviceType.DESKTOP : DeviceType.MOBILE;
    if (newDeviceType !== deviceType) {
      setDeviceType(newDeviceType);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [deviceType]);

  return <>{render({ deviceType })}</>;
};

// export class GetDeviceType extends Component<Props> {
//   private _timer: number | null;
//   private _windowWidth: number;

//   constructor(props: Props) {
//     super(props);
//     this._windowWidth = window.innerWidth;
//     this._timer = null;
//   }

//   componentDidMount(): void {
//     this._checkIsDesktop();
//   }

//   componentWillUnmount(): void {
//     if (this._timer != null) {
//       window.clearImmediate(this._timer);
//     }
//   }

//   private _checkIsDesktop() {
//     this._windowWidth = window.innerWidth;
//     this.forceUpdate(() => {
//       this._timer = window.setImmediate(this._checkIsDesktop.bind(this));
//     });
//   }

//   render() {
//     const { children: render } = this.props;
//     return render({
//       deviceType: this._windowWidth >= 1024 ? DeviceType.DESKTOP : DeviceType.MOBILE,
//     });
//   }
// }
