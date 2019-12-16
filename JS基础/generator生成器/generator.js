const Generator = require("yeoman-generator");

//生成器的用法
//迭代器
function wrapper (generatorFuncgtion) {
  return function (...arg){
    let it = generatorFuncgtion();
    it.next();
    //generatorFuncgtion().next()
    return it
  }
}

const wrapped = wrapper(function* (){
  console.log(`Firsr input: ${yield}`);
  return 'DONE'
})

wrapped().next('hello')

// 利用for of 便利object

 function* objectEntries(obj) {
   let propKeys = Reflect.ownKeys(obj)
    for ( propKey of propKeys) {
      yield [propKey,obj[propKey]]
    }
 }
 let jane = {first: 'Jane', last: 'Doe'}

 for (let [key, valu] of objectEntries(jane)) {
      console.log(`${key}:${valu}`)
 }
 //通过 Symbol.iterator 便利object

  function* objectEntries() {
    let propKeys = Object.keys(this);
    for (let propKey of propkeys) {
      yield [propkey,this[propKey]]
    }
  }
  let jane = {first: 'Jane',last: 'Doe'}
  jane[Symbol.iterator] = objectEntries;
  for ( let [key,valu] of jane) {
    console(`${key}:${valu}`)
  }

  //Generator.proptotype.throw()
  //try catch 只能走一次，第一次被内部捕获，下次被外部捕获，
  //内部不设置try catch 将会外部捕获
  let g = function* () {
    try{
      yield;

    }catch(e) {
      console.log('内部捕获',e)
    }
  }
  let i = g();
  i.next();

  try {
    i.throw('a')
    i.throw('b')
  } catch(e) {
    console.log('体外捕获'+ e)
  }
  //没执行next 直接throw 内部无法捕获，因为generator 没有运行
  //throw 被执行后，会附带执行一下next（）
  let gen = function* gen() {
    try{ 
      yield console.log('a')
    } catch(e) {

    }
    yield console.log('b');
    yield console.log('c')
  }
  var g = gen();
  g.next() 
  g.throw()
  g.next() 
  // throw 与 g.throw 方法是无关，两者不影响
  //generator 内部抛出错误外部也会被捕获
//一旦 Generator 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。如果此后还调用next方法，将返回一个value属性等于undefined、done属性等于true的对象，即 JavaScript 引擎认为这个 Generator 已经运行结束了
  function* foo() {
    var x = yield 3;
    var y = x.toUpperCase();

    yield console.log(y) ;
  }
  let it = foo();
  it.next();
  try {
    it.next(42);
  } catch(err) {
    console.log(err)
    console.log(it.next(2))
  }
