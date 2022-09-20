export function setProps(dom, oldProps, newProps) {
  for (let key in oldProps) {
    if (key === 'children') return;
    if (newProps.hasOwnProperty(key)) {
      setProp(dom, key, newProps[key])
    }else{
      dom.removeAttribute(key)
    }
  }
  for (let key in newProps) {
    if (key === 'children' || oldProps.hasOwnProperty(key)) return;
    setProp(dom, key, newProps[key])
  }
}

function setProp(dom, k, v) {
  if (/^on/.test(k)) {
    dom[k.toLowerCase()] = v
  } else if (k === 'style') {
    for (let styleName in v) {
      dom.style[styleName] = v[styleName]
    }
  } else {
    dom.setAttribute(k, v)
  }
}