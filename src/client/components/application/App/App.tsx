import type { FC } from 'react';
import { lazy, Suspense } from 'react';

// import { SignInModal } from '../../modal/SignInModal';
// import { SignUpModal } from '../../modal/SignUpModal';
import { Providers } from '../Providers';
import { Routes } from '../Routes';
const SignInModal = lazy(() => import('../../modal/SignInModal')
    .then(({ SignInModal }) => ({ default: SignInModal })));
const SignUpModal = lazy(() => import('../../modal/SignUpModal')
    .then(({ SignUpModal }) => ({ default: SignUpModal })));
// const Providers = lazy(() => import('../Providers')
//     .then(({ Providers }) => ({ default: Providers })));
// const Routes = lazy(() => import('../Routes')
//     .then(({ Routes }) => ({ default: Routes })));

export const App: FC = () => (
  <Providers>
    <Routes />
    <SignInModal />
    <SignUpModal />
  </Providers>
);
