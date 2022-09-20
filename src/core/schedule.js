import * as CONST from './const'
import { setProps } from './utils'

let nextUnitOfWork = null
let workInProgressRoot = null
export function schedule(fiber) {
  nextUnitOfWork = workInProgressRoot = fiber
}

function performUnitOfWork(fiber) {
  beginWork(fiber)

  // 向儿子
  if (fiber.child) {
    return fiber.child
  }

  // 向儿子的兄弟、向父亲
  while (fiber) {
    completeUnitOfWork(fiber)
    if (fiber.sibling) {
      return fiber.sibling
    }
    fiber = fiber.return
  }
}

function completeUnitOfWork(fiber) {
  const returnFiber = fiber.return;
  if (!returnFiber) return;

  // 我的儿->父
  if (!returnFiber.firstEffect) {
    returnFiber.firstEffect = fiber.firstEffect
  }
  if (fiber.lastEffect) {
    if (!!returnFiber.lastEffect) {
      returnFiber.lastEffect.nextEffect = fiber.firstEffect
    }
    returnFiber.lastEffect = fiber.lastEffect
  }

  // 我->父
  const effectTag = fiber.effectTag
  if (effectTag) {
    if (!!returnFiber.lastEffect) {
      returnFiber.lastEffect.nextEffect = fiber
    } else {
      returnFiber.firstEffect = fiber
    }
    returnFiber.lastEffect = fiber
  }
}

function beginWork(fiber) {
  switch (fiber.tag) {
    case CONST.TAG_ROOT: {
      updateHostRoot(fiber)
      return;
    }
    case CONST.TAG_TEXT: {
      updateHostText(fiber)
      return;
    }
    case CONST.TAG_HOST: {
      updateHost(fiber)
      return;
    }
  }
}

function createDom(fiber) {
  switch (fiber.tag) {
    case CONST.TAG_TEXT: {
      return document.createTextNode(fiber.props.text);
    }
    case CONST.TAG_HOST: {
      const dom = document.createElement(fiber.type)
      updateDom(dom, {}, fiber.props)
      return dom
    }
  }
}

function updateDom(dom, newProps, oldProps) {
  setProps(dom, newProps, oldProps)
}

function updateHostRoot(fiber) {
  const newChild = fiber.props.children
  reconcileChildren(fiber, newChild)
}
function updateHostText(fiber) {
  if (!fiber.stateNode) {
    fiber.stateNode = createDom(fiber)
  }
}
function updateHost(fiber) {
  if (!fiber.stateNode) {
    fiber.stateNode = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}

// 生成子fiber
function reconcileChildren(fiber, childs) {
  let childIndex = 0,
    prevSibling;
  while (childIndex < childs.length) {
    const child = childs[childIndex]
    let tag;
    if (child.type === CONST.ELEMENT_TEXT) {
      tag = CONST.TAG_TEXT
    } else if (typeof child.type === 'string') {
      tag = CONST.TAG_HOST
    }

    const newFiber = {
      tag,
      type: child.type,
      props: child.props,
      stateNode: null,
      return: fiber, // 返回父
      effectTag: CONST.PLACEMENT, // 状态标识
      nextEffect: null,
      firstEffect: null,
      lastEffect: null
    }
    if (newFiber) {
      if (!childIndex) {
        fiber.child = newFiber
      } else {
        prevSibling.sibling = newFiber
      }
      prevSibling = newFiber
    }
    childIndex++
  }
}

function commitRoot(){
  let fiber = workInProgressRoot.firstEffect
  while(fiber){
    commitWork(fiber)
    fiber = fiber.nextEffect
  }
  workInProgressRoot = null
}

function commitWork(fiber){
  if(!fiber) return;
  const returnFiber = fiber.return
  const returnDom = returnFiber.stateNode
  if(fiber.effectTag === CONST.PLACEMENT){
    returnDom.appendChild(fiber.stateNode)
  }
  fiber.effectTag = null
}

// 执行调度
function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && workInProgressRoot) {
    // console.log(workInProgressRoot);
    // console.log('render');
    commitRoot()
  }
  requestIdleCallback(workLoop, { timeout: 1000 })
}

requestIdleCallback(workLoop, { timeout: 1000 })
