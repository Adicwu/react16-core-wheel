import { ELEMENT_TEXT } from './const';
import { scheduleRoot } from './schedule';
import { Update } from './updateQueue';

function createElement(type, config, ...childs) {
  if (config) {
    delete config.__self;
    delete config.__source;
  }
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

class Component {
  constructor(props) {
    this.props = props
  }
  setState(payload) {
    this.internalFiber.updateQueue.enqueueUpdate(new Update(payload))
    scheduleRoot()
  }
}
Component.prototype.isReactComponent = {}

const React = {
  createElement,
  Component
}
export default React