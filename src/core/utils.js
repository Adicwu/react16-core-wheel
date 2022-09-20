export function setProps(dom, newProps, oldProps) {
  for (let key in newProps) { }
  for (let key in oldProps) {
    if (key === 'children') return;
    setProp(dom, key, oldProps[key])
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