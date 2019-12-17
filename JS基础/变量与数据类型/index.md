# let 
let 生命只在代码块内有效
```
var a = []
for (let i = 0;i <10;i++) {
  a[i] = function () {
    console.log(i);
  }
} 
a[6]();
```
> 每一轮循环的变量i都是重新声明的，它是怎么知道上一轮循环的值，因为js引擎内部会记住上一轮循环的值，初始化本轮循环的值，初始化本轮变量i时，就在上一轮循环的基础上进行计算

另外for循环还有一个特别之处，就是设置循环变量的部分是一个父作用域，而循环体内部是一个单独的子作用域
```
for(let i= 0 ;i <3; i++) {
  let i = 'abc'
  console.log(i)
}
```
## 不存在变量提升
## 暂时性死区
只要块级作用域内存在let，它所声明的变量就绑定了这个区域，不在首外部影响。
```
var tmp = 123;
if (true) {
  tmp = 'abc'
  let tmp ;
}
```
代码中tmp赋值会报错，ES6明确规定，如果区块中存在let 和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域，凡事在声明之前就使用这些变量，就会报错，在代码块内，使用let声明之前，该变量都是不可用的，即使在块外面有个同样名字的全局变量也不行，这称为“暂时性死区”（temporal dead zone TDZ）
> 暂时性死区，意味着typeof 不在百分之一百安全，如果在声明前用typeof 会抛出RefereError（声明前使用也报这个错）。如果一个变量根本没有声明，反而typeof 不会报错

```
function bar (x = y ,y = 2 ) {
  return [x, y ]
}
bar () // 报错

function bar (x = 2 ,y = x ) {
  return [x, y ]
}
bar () // [2, 2]
```
## 不允许重复声明
let 不允许相同作用域内重复声明同一个变量
```
// 报错
function func() {
  let a = 10;
  var a = 1;
}
// 报错
function func() {
  let a = 10;
  let a = 1;
}
```
# 块级作用域
ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。
第一种场景，内层变量可能会覆盖外层变量。
```
var tmp  = new Date ();
function f() {
  console.log(tmp)
  if (false) {
    var tmp =  'hello world '
  } 
}
f() 
```
> 上面代码块，if 内部的tmp 覆盖了上层的tmp ，导致console 值是undefined

第二种场景，用来计数的循环变量泄露为全局变量
```
var s = 'hello' 

for (var i = 0; i < s.length; i++ ) {
  console.log(s[i]);
}
console.log(i)// 5
```
>上面代码中，变量i只用来控制循环，但是循环结束后，它并没有消失，泄露成了全局变量。
## es6 块级作用域
es6 允许块级作用域任意嵌套
块级作用域使得广泛应用的匿名函数（IIFE）不再必要了
```
//情况1 
if(true) {
  function f() {

  }
}
//情况2
try {
  function f() {}
} catch(e) {

}

```
在ES5中这两种声明函数都是非法的，但是浏览器并没有遵守这个规定
ES6引入了会计作用域，明确允许在块级作用域中声明函数，ES6规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用

```
function f() {console.log('I am outside')}
(function () {
  if(false) {
    //重复声明一次函数f
    function f() {console.log('I am inside!')}
  }
  f();
})
```
上面一段代码在ES5环境中，可以运行，因为浏览器没有按照es5规范实现，在es6浏览器中会报错，因为如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大影响。为了减轻因此产生的不兼容问题，ES6 在附录 B里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。
- 允许在块级作用域内声明函数。
- 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
- 同时，函数声明还会提升到所在的块级作用域的头部。
  
注意上面三条规则只对ES6的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作let处理
根据这三条规则，浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于var声明的变量。上面的例子实际运行的代码如下。
```
// 浏览器的 ES6 环境
function f() { console.log('I am outside!'); }
(function () {
  var f = undefined;
  if (false) {
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function
```
考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

```
// 块级作用域内部的函数声明语句，建议不要使用
{
  let a = 'secret';
  function f() {
    return a;
  }
}

// 块级作用域内部，优先使用函数表达式
{
  let a = 'secret';
  let f = function () {
    return a;
  };
}
```
另外，还有一个需要注意的地方。ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域。

```
// 第一种写法，报错
if (true) let x = 1;

// 第二种写法，不报错
if (true) {
  let x = 1;
}
```
上面代码中，第一种写法没有大括号，所以不存在块级作用域，而let只能出现在当前作用域的顶层，所以报错。第二种写法有大括号，所以块级作用域成立。意思就是说，let上面不能加这种if啥的本该有块作用域，却没加块作用域的语法
函数声明也是如此，严格模式下，函数只能声明在当前作用域的顶层
```
// 不报错
'use strict';
if (true) {
  function f() {}
}

// 报错
'use strict';
if (true)
  function f() {}
```

# const 命令
基本用法 const 声明一个只读常量。一旦声明，常量的值就不能改变

```
const PI = 3.1415;
const PI = 3.1415;
PI // 3.1415

PI = 3;
// TypeError: Assignment to constant variable
```
如果想冻结对象，可以用Object。freeze 
```

// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;
```
除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象属性冻结的函数
```
var constantize = (obj) => {
  Object.freeze(obj)
  Object.keys(obj).forEach((key, i) =>{
    if ( typeof obj[key] === 'object') {
      constantize(obj[key])
    }
  })
}
```
## es6 声明变量的六种方法
ES5 只有两种声明变量的方法：var命令和function命令。ES6 除了添加let和const命令，后面章节还会提到，另外两种声明变量的方法：import命令和class命令。所以，ES6 一共有 6 种声明变量的方法。

# 顶层对象的属性
顶层对象，在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的。
```
window.a = 1;
a // 1

a = 2;
window.a // 2
```
上面代码中，顶层对象的属性赋值与全局变量的赋值，是同一件事。
顶层对象的属性与全局变量挂钩，被认为是 JavaScript 语言最大的设计败笔之一。这样的设计带来了几个很大的问题，首先是没法在编译时就报出变量未声明的错误，只有运行时才能知道（因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的）；其次，程序员很容易不知不觉地就创建了全局变量（比如打字出错）；最后，顶层对象的属性是到处可以读写的，这非常不利于模块化编程。另一方面，window对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也是不合适的。
ES6 为了改变这一点，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩
```
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```
上面代码中，全局变量a由var命令声明，所以它是顶层对象的属性；全局变量b由let命令声明，所以它不是顶层对象的属性，返回undefined。

# globalThis 
是一个提案
JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。

浏览器里面，顶层对象是window，但 Node 和 Web Worker 没有window。
浏览器和 Web Worker 里面，self也指向顶层对象，但是 Node 没有self。
Node 里面，顶层对象是global，但其他环境都不支持。
同一段代码为了能够在各种环境，都能取到顶层对象，现在一般是使用this变量，但是有局限性。

全局环境中，this会返回顶层对象。但是，Node 模块和 ES6 模块中，this返回的是当前模块。
函数里面的this，如果函数不是作为对象的方法运行，而是单纯作为函数运行，this会指向顶层对象。但是，严格模式下，这时this会返回undefined。
不管是严格模式，还是普通模式，new Function('return this')()，总是会返回全局对象。但是，如果浏览器用了 CSP（Content Security Policy，内容安全策略），那么eval、new Function这些方法都可能无法使用。
综上所述，很难找到一种方法，可以在所有情况下，都取到顶层对象。下面是两种勉强可以使用的方法。
```
// 方法一
(typeof window !== 'undefined'
   ? window
   : (typeof process === 'object' &&
      typeof require === 'function' &&
      typeof global === 'object')
     ? global
     : this);

// 方法二
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```
现在有一个[提案](https://github.com/tc39/proposal-global)，在语言标准的层面，引入globalThis作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。

垫片库global-this模拟了这个提案，可以在所有环境拿到globalThis。