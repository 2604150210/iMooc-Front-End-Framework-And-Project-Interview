const $p1 = document.createElement('p')
$p1.innerHTML = "一段文字1"
const $p2 = document.createElement('p')
$p2.innerHTML = "一段文字2"
const $p3 = document.createElement('p')
$p3.innerHTML = "一段文字3"
const container = document.getElementById('container')
container.appendChild($p1)
container.appendChild($p2)
container.appendChild($p3)

// 微任务： DOM渲染前触发
Promise.resolve().then(() => {
  console.log('length1', container.childNodes.length)
  alert('Promise') // DOM 还没渲染
})

// 宏任务： DOM渲染前触发
setTimeout(() => {
  console.log('length2', container.childNodes.length)
  alert('setTimeout') // DOM 已经渲染了
});