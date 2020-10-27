function muti (num) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num * num)
    }, 1000)
  })
}

const nums = [1, 2, 3]

// forEach是同步循环，1 4 9 结果同时在一秒钟后出来
nums.forEach(async (i) => {
  const res = await muti(i)
  console.log(res)
})

// for-of是异步循环，1 4 9 结果每个间隔一秒后出来
!(async function () {
  for (let i of nums) {
    const res = await muti(i)
    console.log(res)
  }
})()
