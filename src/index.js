import React from './core/react'
import ReactDom from './core/react-dom'

class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 0
    }
  }
  clc = () => {
    // console.log('123');
    this.setState((e) => ({
      num: e.num + 1
    }))
  }
  render() {
    // console.log(this);
    return (
      <div id="app">
        {/* <h1>{this.state.num}</h1> */}
        <button onClick={this.clc}>click</button>
      </div>
    )
  }
}



function Todo() {
  return <h1>todo</h1>
}

ReactDom.render(
  (
    <div id="test"><Todo /></div>
  ),
  // <h1 id="a1" />,
  document.getElementById('root')
)