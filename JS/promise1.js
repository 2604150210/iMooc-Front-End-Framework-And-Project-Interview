async function async1 () {
  console.log('async1 start') // 2
  await async2()
  // await 的后面，都可以看做是callback里面的内容，即异步
  // 类似 event loop
  // 下面三行是异步回调内容
  console.log('async1 end') // 5
  await async3()
  console.log('async1 end2') // 7
}

async function async2 () {
  console.log('async2') // 3
}

async function async3() {
  console.log('async3') // 6
}

console.log('script start') // 1
async1()
console.log('script end') // 4