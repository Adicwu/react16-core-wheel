import { TAG_ROOT } from './const'
import { schedule } from './schedule'

function render(el, container) {
  schedule({
    tag: TAG_ROOT,
    stateNode: container,
    props: {
      children: [el]
    }
  })
}

const ReactDom = {
  render
}
export default ReactDom;