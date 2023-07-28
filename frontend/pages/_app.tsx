import '../styles/globals.css';
import React, { FunctionComponent } from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux'
import store, { persistor } from '../lib/store/reducers/reduce';
import { PersistGate } from 'redux-persist/integration/react';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
};

export default App;
