import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'redux-little-router';

export default store => Root =>
  <Provider store={store}>
    <RouterProvider store={store}>
      <Root />
    </RouterProvider>
  </Provider>;