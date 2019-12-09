

//Promies特点
//“promise” is an object or function with a then method whose behavior conforms to this specification.
//“thenable” is an object or function that defines a then method
//“value” is any legal JavaScript value (including undefined, a thenable, or a promise).
//“exception” is a value that is thrown using the throw statement.
//“reason” is a value that indicates why a promise was rejected.
const PENDING = 'PENDING'
const FULFILLED = 'FUFILLED'
const REJECTED = 'REJECTED'

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
    if(this.state === PENDING) {
      this.onFulfiledAry.push(() =>{
        onFulfiled(this.value)
      })
      this.onRejectedAry.push(() =>{
        onRejected(this.reason)
      })
    }
    if(this.state === FULFILLED) onFulfiled(this.value)
    if(this.state === REJECTED) onRejected(this.reason)
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