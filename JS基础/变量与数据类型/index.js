var a = []
for (var i = 0;i <10;i++) {
  a[i] = function () {
    console.log(i);
  }
} 
a[6]();

for(let i= 0 ;i <3; i++) {
  console.log(i) // 暂存性死去
  let i = 'abc'
  console.log(i)
}

function bar (x = y ,y = 2 ) {
  return [x, y ]
}
bar () 

function bar (x = 2 ,y = x ) {
  return [x, y ]
}
bar () 
// 内部作用域覆盖外部作用域

var tmp  = new Date ();
function f() {
  console.log(tmp)
  if (false) {
    var tmp =  'hello world '
  } 
}
f() 
// 第二种场景，用来计数的循环变量泄露为全局变量
var s = 'hello' 
for (var i = 0; i < s.length; i++ ) {
  console.log(s[i]);
}
console.log(i)

var s = 'hello' 

for (let i = 0; i < s.length; i++ ) {
  console.log(s[i]);
}
console.log(i)

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

// ES5 环境
function f() { console.log('I am outside!'); }

(function () {
  function f() { console.log('I am inside!'); }
  if (false) {
  }
  f();
}());

var a = 1 
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());

// 浏览器的 ES6 环境
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());

// 第一种写法，报错
if (true) let x = 1;

// 第二种写法，不报错
if (true) {
  let x = 1;
}

{
  if (true) let x = 1 
  console.log(x)
}


var constantize = (obj) => {
  Object.freeze(obj)
  Object.keys(obj).forEach((key, i) =>{
    if ( typeof obj[key] === 'object') {
      constantize(obj[key])
    }
  })
}