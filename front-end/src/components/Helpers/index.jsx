import React from 'react';

import { useSearchParams } from 'react-router-dom';

export const withSearchParams = (Component) => {

  const ComponentWithSearchParams = (props) => {

    const [searchParams] = useSearchParams({});
    return <Component { ...props } searchParams={ searchParams } />

  }

  return ComponentWithSearchParams;

}

const ComponentHelpers = Object.freeze({
  withSearchParams,
});

export default ComponentHelpers;
