import { ELEMENT_TEXT } from './const';

function createElement(type, config, ...childs) {
  delete config.__self;
  delete config.__source;
  return {
    type,
    props: {
      ...config,
      children: childs.map(child => typeof child === 'object' ? child : {
        type: ELEMENT_TEXT,
        props: { text: child, children: {} }
      })
    }
  }
}

const React = {
  createElement
}
export default React