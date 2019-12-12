const PENDING = 'PENDING'
const FULFILLED = 'FUFILLED'
const REJECTED = 'REJECTED'
function resolvePromise(promise2, x, resolve, rejected) {
  if (promise2 === x) {
    return rejected(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
  }
  let called 
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      let then = x.then
      if (typeof then === 'function') {
        try {
          then.call(x, (y) => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, rejected)
          }, (r) => {
            if (called) return
            called = true
            rejected(r)
          })
        } catch (err) {
          if (called) return
          called = true
          rejected(err)
        }
      } else {
        resolve(x)
      }
    } catch (err) {
      if (called) return
      called = true
      rejected(err)
    }
  } else {
    resolve(x)
  }
}
class Promise {
  constructor(execute) {
    this.value = undefined
    this.reason = undefined
    this.state = PENDING
    this.onFulfiledAry = []
    this.onRejectedAry = []
    let resolve = (data) => {
      if (this.state === PENDING) {
        this.value = data
        this.state = FULFILLED
        this.onFulfiledAry.forEach(ele => ele())
      }
    }
    let rejected = (data) => {
      if (this.state === PENDING) {
        this.reason = data
        this.state = REJECTED
        this.onRejectedAry.forEach(ele => ele())
      }
    }
    try {
      execute(resolve, rejected);
    } catch (e) {
      rejected(e)
    }
  }
  then(onFulfiled, onRejected) {
    onFulfiled = typeof onFulfiled === 'function' ? onFulfiled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
    let promise2 = new Promise((resolve, rejected) => {
      if (this.state === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfiled(this.value)
            resolvePromise(promise2, x, resolve, rejected)
          } catch (err) {
            rejected(err)
          }
        })
      }
      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, rejected)
          } catch (err) {
            rejected(err)
          }
        })
      }
      if (this.state === PENDING) {
        this.onFulfiledAry.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfiled(this.value)
              resolvePromise(promise2, x, resolve, rejected)
            } catch (err) {
              rejected(err)
            }
          })
        })
        this.onRejectedAry.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, rejected)
            } catch (err) {
              rejected(err)
            }
          })
        })
      }
    })
    return promise2
  }
}
// let p  = new Promise((resolev,rejected) =>{
//   setTimeout(() =>{
//     resolev('success')
//   })

// }) 
// p.then(null, (err) =>{
//   console.log("err")
// }).then(data =>{
//   console.log("@@@@@@")
//   console.log(data)
// })
// p.then().then((data) =>{
//   console.log(data)
// }).then(false,(err) =>{
//   console.log(err)
// })

Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

module.exports = Promise;
//判断resole的是promies
//catch 实际是一个then（null，（） =>{}） 语法糖
// 实现一饿promise.finally  
//Promise.try 
//promise.race 
// 如何终止一个promise ，不要当前这个promise结果
//如果中断promise链