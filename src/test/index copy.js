// import React from '../core/react'
// import ReactDom from '../core/react-dom'

// const style = {
//   padding: '8px',
//   border: '2px solid crimson'
// }

// const style2 = {
//   padding: '8px',
//   border: '3px solid green'
// }

// const el = (
//   <div id="a1" style={style}>
//     a1
//     <div id="b1" style={style}>
//       b1
//       <div id="c1" style={style}>
//         c1
//       </div>
//       <div id="c2" style={style}>
//         c2
//       </div>
//     </div>
//     <div id="b2" style={style}>b2</div>
//   </div>
// )
// console.log(el);
// ReactDom.render(
//   el,
//   document.getElementById('root')
// )

// document.getElementById('change1').addEventListener('click', () => {
//   ReactDom.render(
//     (
//       <div id="a1-new" style={style2}>
//         a1-new
//         <div id="b1-new" style={style2}>
//           b1-new
//           <div id="c1-new" style={style2}>
//             c1-new
//           </div>
//           <div id="c2-new" style={style}>
//             c2-new
//           </div>
//         </div>
//         <div id="b2-new" style={style}>b2-new</div>
//       </div>
//     ),
//     document.getElementById('root')
//   )
// })

// document.getElementById('change2').addEventListener('click', () => {
//   ReactDom.render(
//     (
//       <div id="a1-new" style={style2}>
//         a1-new
//         <div id="b1-new" style={style2}>
//           b1-new
//           <div id="c1-new" style={style2}>
//             c1-new
//           </div>
//         </div>
//       </div>
//     ),
//     document.getElementById('root')
//   )
// })