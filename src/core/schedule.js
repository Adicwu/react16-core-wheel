import * as CONST from './const'
import { UpdateQueue } from './updateQueue'
import { setProps } from './utils'

/** 当前工作fiber 暂存区 */
let nextUnitOfWork = null

/** 当前处理fiber 暂存区 */
let workInProgressRoot = null

/** 当前页面渲染的fiber */
let currentRoot = null

/** deletions-effect 集合 */
let deletions = []

export function scheduleRoot(fiber) {
  if (currentRoot && currentRoot.alternate) {
    workInProgressRoot = currentRoot.alternate
    workInProgressRoot.alternate = currentRoot
    if (fiber) workInProgressRoot.props = fiber.props
  } else if (currentRoot) {
    if (fiber) {
      fiber.alternate = currentRoot
      workInProgressRoot = fiber
    } else {
      workInProgressRoot = {
        ...currentRoot,
        alternate: currentRoot
      }
    }
  } else {
    workInProgressRoot = fiber
  }
  workInProgressRoot.firstEffect = workInProgressRoot.lastEffect = workInProgressRoot.nextEffect
  nextUnitOfWork = workInProgressRoot
  console.log(workInProgressRoot);
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
      break;
    }
    case CONST.TAG_TEXT: {
      updateHostText(fiber)
      break;
    }
    case CONST.TAG_HOST: {
      updateHost(fiber)
      break;
    }
    case CONST.TAG_CLASS: {
      updateClassComponent(fiber)
      break;
    }
    case CONST.TAG_FUNCTION: {
      updateFuncComponent(fiber)
      break;
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

function updateDom(dom, oldProps, newProps) {
  dom.setAttribute && setProps(dom, oldProps, newProps)
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
function updateClassComponent(fiber) {
  // console.log(fiber);
  if (!fiber.stateNode) {
    fiber.stateNode = new fiber.type(fiber.props)
    fiber.stateNode.internalFiber = fiber
    fiber.updateQueue = new UpdateQueue()
  }
  fiber.stateNode.state = fiber.updateQueue.forceUpdate(fiber.stateNode.state)
  const newEl = fiber.stateNode.render()
  reconcileChildren(fiber, [newEl])
}
function updateFuncComponent(fiber) {
  const newEl = fiber.type(fiber.props)
  reconcileChildren(fiber, [newEl])
}

// 生成子fiber
function reconcileChildren(fiber, childs) {
  let childIndex = 0,
    oldFiber = fiber.alternate && fiber.alternate.child,
    prevSibling;
  oldFiber && (oldFiber.firstEffect = oldFiber.lastEffect = oldFiber.nextEffect = null)
  while (childIndex < childs.length || oldFiber) {
    const child = childs[childIndex]
    let newFiber,
      tag;
    const isSameType = oldFiber && child && oldFiber.type === child.type

    if (child) {
      if (typeof child.type === 'function' && child.type.prototype.isReactComponent) {
        tag = CONST.TAG_CLASS
      } else if (typeof child.type === 'function') {
        tag = CONST.TAG_FUNCTION
      } else if (child.type === CONST.ELEMENT_TEXT) {
        tag = CONST.TAG_TEXT
      } else if (typeof child.type === 'string') {
        tag = CONST.TAG_HOST
      }
    }

    if (isSameType) {
      newFiber = {
        tag: oldFiber.tag,
        type: oldFiber.type,
        props: child.props,
        stateNode: oldFiber.stateNode,
        updateQueue: oldFiber.updateQueue || new UpdateQueue(),
        return: fiber,
        alternate: oldFiber,
        effectTag: CONST.UPDATE,
        nextEffect: null,
        firstEffect: null,
        lastEffect: null
      }
    } else {
      if (child) {
        newFiber = {
          tag,
          type: child.type,
          props: child.props,
          stateNode: null,
          updateQueue: new UpdateQueue(),
          return: fiber, // 返回父
          effectTag: CONST.PLACEMENT, // 状态标识
          nextEffect: null,
          firstEffect: null,
          lastEffect: null
        }
      }
      if (oldFiber) {
        oldFiber.effectTag = CONST.DELETION
        deletions.push(oldFiber)
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
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

// fiber变动提交
function commitRoot() {
  deletions.forEach(commitWork)
  let fiber = workInProgressRoot.firstEffect
  while (fiber) {
    commitWork(fiber)
    fiber = fiber.nextEffect
  }
  deletions.length = 0
  currentRoot = workInProgressRoot
  workInProgressRoot = null
}
// fiber变动提交 - 提交内容处理
function commitWork(fiber) {
  if (!fiber) return;
  let returnFiber = fiber.return
  while (![CONST.TAG_HOST, CONST.TAG_ROOT, CONST.TAG_TEXT].includes(returnFiber.tag)) {
    returnFiber = returnFiber.return
  }
  const returnDom = returnFiber.stateNode

  switch (fiber.effectTag) {
    case CONST.PLACEMENT: {
      let nextFiber = fiber
      while (![CONST.TAG_HOST, CONST.TAG_TEXT].includes(nextFiber.tag)) {
        nextFiber = nextFiber.child
      }
      returnDom.appendChild(nextFiber.stateNode)
      break;
    }
    case CONST.DELETION: {
      commitDeletion(fiber, returnDom)
      break;
    }
    case CONST.UPDATE: {
      if (fiber.type === CONST.ELEMENT_TEXT) {
        if (fiber.alternate.props.text !== fiber.props.text)
          fiber.stateNode.textContent = fiber.props.text
      } else {
        updateDom(fiber.stateNode, fiber.alternate.props, fiber.props)
      }
      break;
    }
  }
  fiber.effectTag = null
}
function commitDeletion(fiber, returnDom) {
  if ([CONST.TAG_HOST, CONST.TAG_TEXT].includes(fiber.tag)) {
    returnDom.removeChild(fiber.stateNode)
  } else {
    commitDeletion(fiber.child, returnDom)
  }
}

// 任务调度
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
  requestIdleCallback(workLoop, { timeout: 1000 }) // 后台自动化运行
}
requestIdleCallback(workLoop, { timeout: 1000 })
