# set 
ES6提供的新的数据结构
Set本身是一个构造函数，用来生成set数据结构
```
const s = new Set()
[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x)) 
for (let i of s ) {
  console.log(i)
}
```
add() 方法想Set结构加入成员，结果表明，set不会添加重复的值
Set 可以接受一个数组（或者具有iterable接口的其他数据结构）作为参数，用来初始化
```
//列1
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

//列2
const items = new Set(1, 2, 3, 4, 5, 5, 5, 5])
items.size // 5 

//列3 
const set = new Set(document.querySelectorAll('div'));
set.size // 56

```
列1和列2 都是Set 函数接受数组为参数，例3是接受类似数组的对象作为参数，上面代码也展示了一种数组去重的方法
```
[...new Set(array)]
```