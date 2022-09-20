import { TAG_ROOT } from './const'
import { scheduleRoot } from './schedule'

function render(el, container) {
  scheduleRoot({
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