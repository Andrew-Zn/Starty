

//Promies特点
//“promise” is an object or function with a then method whose behavior conforms to this specification.
//“thenable” is an object or function that defines a then method
//“value” is any legal JavaScript value (including undefined, a thenable, or a promise).
//“exception” is a value that is thrown using the throw statement.
//“reason” is a value that indicates why a promise was rejected.
const PENDING = 'PENDING'
const FULFILLED = 'FUFILLED'
const REJECTED = 'REJECTED'
const resolevPromise = (promise2, x, resolev, rejected) => {
  if(promise2 === x) {
    throw new Error('Promise err ')//这写的不对 要return 到reject 
  }
  if((typeof x === 'object' && x !== null ) || typeof x === 'function') {
    let called = false
    try {
      let then = x.then 
      if(typeof then === 'function') {
        try {
          then.call(x,(y) =>{
            if (called) return 
            called = true 
            resolevPromise(promise2,y,resolev,rejected)
          },(r)=>{
            if (called) return 
            called = true 
            rejected(r)
          })
        } catch(e ) {
          if (called) return 
          called = true 
          rejected(e)
        }
      }
    } catch(e) {
      rejected(e)
    }
  } else {
    resolev(x)
  }
}
class Promise  {
  constructor(execute) {
    this.value = undefined
    this.reason = undefined
    this.state = PENDING 
    this.onFulfiledAry = []
    this.onRejectedAry = []
    let resolev = (data) =>{
      if(this.state === PENDING) {
        this.value = data
        this.state = FULFILLED
        this.onFulfiledAry.forEach(ele => ele())
      }
    }
    let rejected = (data) =>{
      if(this.state === PENDING) {
        this.reason = data 
        this.state = REJECTED
        this.onRejectedAry.forEach(ele => ele())
      }
    }
    try {
      execute(resolev, rejected);
    } catch(e) {
      rejected(e)
    }
    
  }
  then(onFulfiled, onRejected) {
    let promise2 = new Promise((resolev, rejected) =>{
      if(this.state === FULFILLED) {
        try{
          let x = onFulfiled(this.value)
          setTimeout(()=>{
            resolevPromise(promise2,x,resolev,rejected)
          })
          
        } catch (e) {
          rejected(e)
        }
      }
      if(this.state === REJECTED) {
        try {
          let x = onRejected(this.reason)
          setTimeout(()=>{
            resolevPromise(promise2,x,resolev,rejected)
          })
        } catch(e) {
          rejected(e)
        }

      }
      if(this.state === PENDING) {
        this.onFulfiledAry.push(() =>{
          try{
            onFulfiled(this.value)
            setTimeout(()=>{
              resolevPromise(promise2,x,resolev,rejected)
            })
          }catch(e) {
            rejected(e)
          }

        })
        this.onRejectedAry.push(() =>{
          try{
            onRejected(this.reason)
            setTimeout(()=>{
              resolevPromise(promise2,x,resolev,rejected)
            })
          }catch(e) {
            rejected(e)
          }

        })
      }
    })
    return promise2 
  }
} 
let p  = new Promise((resolev,rejected) =>{
  setTimeout(() =>{
    resolev('success')
  })
  
}) 
p.then((data) =>{
  console.log(data)
}, (err) =>{
  console.log("err")
})
p.then(data =>{
  console.log(data)
})