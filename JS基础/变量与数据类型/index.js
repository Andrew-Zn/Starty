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