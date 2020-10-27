async function f1() {
  return 100
}
async function f2() {
  const a = f1()
  console.log(a) // 1
  const b = await f1()
  console.log(b) // 3
  const c = await f1()
  console.log(c) // 4
  return 200
}

async function f3() {
  const d = await f2()
  console.log(d) // 5
}

f3()
console.log(11) // 2