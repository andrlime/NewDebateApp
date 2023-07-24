import '../styles/globals.css';
import React, { FunctionComponent } from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux'
import store from '../lib/store/reducers/reduce';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
