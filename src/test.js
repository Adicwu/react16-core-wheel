function sleep(delay) {
  // const t = Date.now()
  // while (Date.now() - t <= delay) { }
  for (var s = Date.now(); Date.now() - s <= delay;) { }
}

; (() => {

  const tasks = [
    () => {
      console.log('1 start');
      sleep(20)
      console.log('1 end');
    },
    () => {
      console.log('2 start');
      sleep(20)
      console.log('2 end');
    },
    () => {
      console.log('3 start');
      sleep(20)
      console.log('3 end');
    },
  ]

  // requestIdleCallback(workLoop, {
  //   timeout: 1000
  // })

  function workLoop(deadline) {
    console.log('deadline', deadline.timeRemaining());
    while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.length > 0) {
      performUnitOfWork()
    }
    if (tasks.length > 0) {
      requestIdleCallback(workLoop, {

      })
    }
  }

  function performUnitOfWork() {
    tasks.shift()()
  }
})()

  ; (() => {
    class Update {
      constructor(payload, nextUpdate) {
        this.payload = payload
        this.nextUpdate = nextUpdate
      }
    }
    class UpdateQueue {
      constructor() {
        this.baseState = null
        this.firstUpdate = null
        this.lastUpdate = null
      }
      enqueueUpdate(update) {
        if (this.firstUpdate === null) {
          this.firstUpdate = this.lastUpdate = update
        } else {
          this.lastUpdate.nextUpdate = update
          this.lastUpdate = update
        }
      }
      forceUpdate() {
        let currentState = this.baseState || {}
        let currentUpdate = this.firstUpdate
        while (currentUpdate) {
          const state = typeof currentUpdate.payload === 'function' ? currentUpdate.payload(currentState) : currentUpdate.payload
          currentState = { ...currentState, ...state }
          currentUpdate = currentUpdate.nextUpdate
        }
        this.baseState = currentState
        console.log(this.baseState);
      }
    }
    // const qu = new UpdateQueue()
    // qu.enqueueUpdate(new Update({ name: 'adic' }))
    // qu.enqueueUpdate(new Update((e) => ({
    //   name: e.name + ' wu'
    // })))
    // qu.enqueueUpdate(new Update({ age: 18 }))
    // qu.forceUpdate()
  })()

  ; (() => {
    function rendeRoot() {
      const A1 = {
        type: 'div',
        key: 'A',
      }
      const B1 = {
        type: 'div',
        key: 'B1',
        return: A1,
      }
      const B2 = {
        type: 'div',
        key: 'B2',
        return: A1,
      }
      const C1 = {
        type: 'div',
        key: 'C1',
        return: B1,
      }
      const C2 = {
        type: 'div',
        key: 'C2',
        return: B1,
      }
      A1.child = B1
      B1.child = C1
      B1.sibling = B2
      C1.sibling = C2
      return A1
    }
    const rootFiber = rendeRoot()
    let nextUnitOfWork = null

    function workLoop(deadline) {
      console.log('deadline', deadline.timeRemaining());
      while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && nextUnitOfWork) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
      }
      if (!nextUnitOfWork) {
        console.log('close');
      } else {
        requestIdleCallback(workLoop, { timeout: 1000 })
      }
    }

    function performUnitOfWork(fiber) {
      beginWork(fiber)
      if (fiber.child) {
        return fiber.child
      }
      while (fiber) {
        completeUnitOfWork(fiber)
        if (fiber.sibling) {
          return fiber.sibling
        }
        fiber = fiber.return
      }
    }

    function beginWork(fiber) {
      sleep(20)
      console.log('start', fiber.key);
    }
    function completeUnitOfWork(fiber) {
      console.log('end', fiber.key);
    }

    nextUnitOfWork = rootFiber
    requestIdleCallback(workLoop, { timeout: 1000 })
  })()