import React from 'react';

import StringsEnglish from './strings/English';
import ErrorsEnglish from './errors/English';

let user = JSON.parse(sessionStorage.getItem('user'));

console.log ( 'user');
console.log ( user);

export const defaultContext = Object.freeze({
  strings: StringsEnglish,
  errors: ErrorsEnglish,
  app: null, // app component
  user: user, // logged-in user
});

const AppContext = React.createContext(defaultContext);

export default AppContext;
