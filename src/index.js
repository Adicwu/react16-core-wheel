import React from './core/react'
import ReactDom from './core/react-dom'

const style = {
  padding: '8px',
  border: '2px solid crimson'
}

const el = (
  <div id="a1" style={style}>
    a1
    <div id="b1" style={style}>
      b1
      <div id="c1" style={style}>
        c1
      </div>
      <div id="c2" style={style}>
        c2
      </div>
    </div>
    <div id="b2" style={style}>b2</div>
  </div>
)
console.log(el);
ReactDom.render(
  el,
  document.getElementById('root')
)