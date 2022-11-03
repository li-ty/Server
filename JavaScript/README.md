
### 分组求和函数：
``` js
      function GroupBy(datas,keys,callBack) {
          const list = datas || [];
          const groups = [];
          list.forEach(v => {
              const key = {};
              const data = {};
              keys.forEach(k => {
                  key[k] = v[k];
              });
              let group = groups.find(v => {
                  return v._key === JSON.stringify(key);
              });
              if (!group) {
                  group = {
                      _key:JSON.stringify(key),
                      key: key,
                  };
                  groups.push(group);
              }
              if(callBack){
                  group.data = callBack(group.data,v);
                  group.total=group.total||0;
                  group.total++;
              }else {
                  group.data=group.data||[];
                  group.data.push(v);
              }
          });
          return groups;
      }
```

### 性能极致优化版（JSON.stringify太耗性能）
``` js
    function groupBy(list, keys) {
        const groups = [];
        list.forEach(i => {
            const key = {};
            keys.forEach(k => {
                key[k] = i[k];
            });
            let group = groups.find(g => keys.every(k => g.key[k] === key[k]));
            if (!group) {
                group = { key: key };
                groups.push(group);
            }
            group.data = group.data || [];
            group.data.push(i);
        });
        return groups;
    }
```


测试函数
``` js
        window.onload=function () {
            const data = [
                {key:1,key2:1,v:123},
                {key:1,key2:1,v:55},
                {key:2,key2:1,v:85},
                {key:1,key2:2,v:15},
                {key:2,key2:1,v:99}
            ];
            var d = GroupBy(data,['key','key2'],(d,v)=> {
                d = d||0;
                return d+=v.v;
            });
            console.log(d);
            var a = GroupBy(data,['key','key2']);
            console.log(a);
        };
```

## 实现浅拷贝与深拷贝
`Js`包含基本数据类型与引用数据类型两种不同的数据类型的值，深拷贝与浅拷贝的概念只存在于引用数据类型。对于引用类型，浅拷贝是拷贝了指向这个对象堆内存的指针，是拷贝了对原对象引用，深拷贝是拷贝了该对象的所有属性到一个新的对象，若是原对象的某属性依然引用了其他对象，那么需要将原对象引用的其他对象一并进行深拷贝，并不断递归进行。对于基本数据类型是不存在深拷贝与浅拷贝的概念的，如果将一个基本数据类型变量的值赋值到另一个变量，那么新变量的值是对于原变量值的复制而不是引用，如果必须要按照深浅拷贝的概念理解的话，对于基本数据类型的复制可以理解为按值深拷贝。


## 原生方法实现
原生方法实现浅拷贝，可以使用`{...obj}`与`Object.assign({}, obj)`等方式，`{...obj}`主要是使用了`Spread`操作符将对象表达式展开构造字面量对象的方式实现浅拷贝，对于`Object.assign({}, obj)`是执行了一次将可枚举属性复制到目标对象并返回目标对象的操作。关于`Object.assign`是浅拷贝还是对于第一层是深拷贝之后是浅拷贝的说法，主要取决于如何理解浅拷贝与深拷贝的概念，假如同本文一样认为只有引用类型才有浅拷贝与深拷贝的概念的话，那么`Object.assign`就是浅拷贝；假如认为对于基本数据类型也有浅拷贝与深拷贝的概念的话，那么如上文所述对于基本数据类型的拷贝可以理解为按值深拷贝，那么关于`Object.assign`第一层是深拷贝，第二层及以后是浅拷贝的说法也是没有问题的。  
原生方法实现深拷贝，主要是使用`JSON.parse()`与`JSON.stringify()`，首先将对象序列化为`JSON`字符串，再将`JSON`字符串反序列化为对象，使用这种方式效率比较高，但是会有一些问题，对于循环引用的对象无法实现深拷贝，对于被拷贝的对象，如果对象中有属性为`Date`对象，此种方式深拷贝会将时间对象转化为字符串；如果对象中有属性为`RegExp`对象、`Error`对象，此种方式深拷贝会得到一个空对象；如果对象中有属性为`function`对象、`undefined`、`Symbol`值，此种方式深拷贝会忽略这些值；如果对象中有属性为`NaN`、`Infinity`、`-Infinity`，此种方式深拷贝会将结果转为`null`。
```javascript
function shallowCopy(target, origin){
    return Object.assign(target, origin);
}

function deepCopy(target, origin){
    var originDeepCopy = JSON.parse(JSON.stringify(origin)); 
    return Object.assign(target, originDeepCopy);
}

// 浅拷贝测试 将origin中属性浅拷贝到target
var target = {}
var origin = {
    // a属性为引用类型
    a: { 
        aa: 1
    } 
}
shallowCopy(target, origin);
console.log(target, origin); // {a: {aa: 1}} {a: {aa: 1}}
origin.a.aa = 11;
console.log(target, origin); // {a: {aa: 11}} {a: {aa: 11}}

// 深拷贝测试 将origin中属性深拷贝到target
var target = {}
var origin = {
    // a属性为引用类型
    a: { 
        aa: 1
    } 
}
deepCopy(target, origin);
console.log(target, origin); // {a: {aa: 1}} {a: {aa: 1}}
origin.a.aa = 11;
console.log(target, origin); // {a: {aa: 1}} {a: {aa: 11}}
```

## 递归实现
对于浅拷贝，只需要处理被拷贝对象的所有的可枚举属性进行赋值即可。  
对于深拷贝，需要将基本数据类型进行赋值，然后对对象属性进行递归处理。
```javascript
function shallowCopy(target, origin){
    for(let item in origin) target[item] = origin[item];
    return target;
}

function deepCopy(target, origin){
    for(let item in origin) {
        if(origin[item] && typeof(origin[item]) === "object") {
            // 只对Object Array Date RegExp对象做了简单处理
            if(Object.prototype.toString.call(origin[item]) === "[object Object]"){
                target[item] = deepCopy({}, origin[item]);
            }else if(origin[item] instanceof Array){
                target[item] = deepCopy([], origin[item]);
            }else if(origin[item] instanceof Date){
                target[item] = new Date(origin[item]);
            }else if(origin[item] instanceof RegExp){
                target[item] = new RegExp(origin[item].source, origin[item].flags);
            }else{
                 target[item] = origin[item];
            }
        }else{
            target[item] = origin[item];
        }
    }
    return target;
}

// 浅拷贝测试 将origin中属性浅拷贝到target
var target = {}
var origin = {
    // a属性为引用类型
    a: { 
        aa: 1
    } 
}
shallowCopy(target, origin);
console.log(target, origin); // {a: {aa: 1}} {a: {aa: 1}}
origin.a.aa = 11;
console.log(target, origin); // {a: {aa: 11}} {a: {aa: 11}}

// 深拷贝测试 将origin中属性深拷贝到target
var target = {}
var origin = {
    // a属性为引用类型
    a: { 
        aa: 1,
        bb: {bbb: 1},
        cc: [1, {ccc: 1}],
        dd: new Date().getTime(),
        ee: /./g
    } 
}
deepCopy(target, origin);
console.log(target, origin);
/*
  a: {                  a: {
    aa: 1                 aa: 1
    bb: {bbb: 1}          bb: {bbb: 1}
    cc: [1, {ccc: 1}]     cc: [1, {ccc: 1}]
    dd: 1390318311560     dd: 1390318311560
    ee: /./g              ee: /./g
  }                     }
*/
origin.a.aa = 11;
origin.a.bb.bbb = 11;
origin.a.cc[0] = 11;
origin.a.cc[1].ccc = 11;
origin.a.dd = new Date().getTime();
origin.a.ee = /./gi;
console.log(target, origin);
/*
  a: {                  a: {
    aa: 1                 aa: 11
    bb: {bbb: 1}          bb: {bbb: 11}
    cc: [1, {ccc: 1}]     cc: [11, {ccc: 11}]
    dd: 1390318311560     dd: 1390318792391
    ee: /./g              ee: /./gi
  }                     }
*/
```

## 递归实现（简化版）

```javascript
function clone(obj){
    if(typeof obj !== "object") return obj;
    let res;
    if(obj instanceof Object)
        res = {};
    else
        res = [];
    for(let key in obj){
        res[key] = clone(obj[key])
    }
    return res;
}
```




### 数组排序
#### 原型链方法调用
``` js
var arr = [1, 7, 9, 8, 3, 2, 6, 0, 5, 4];
arr.sort((a,b) => a-b); // arr.__proto__.sort
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

#### 简单选择排序
``` js
var arr = [1, 7, 9, 8, 3, 2, 6, 0, 5, 4];
var n = arr.length;
for(let i=0; i<n; ++i){
    let minIndex = i;
    for(let k=i+1; k<n; ++k){
        if(arr[k] < arr[minIndex]) minIndex = k;
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
}
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// 平均时间复杂度 O(n²) 最好情况 O(n²) 最坏情况 O(n²) 空间复杂度 O(1) 不稳定排序
```
#### 冒泡排序
``` js
var arr = [1, 7, 9, 8, 3, 2, 6, 0, 5, 4];
var n = arr.length;
for(let i=0; i<n; ++i){
    let swapFlag = false;
    for(let k=0; k<n-i-1; ++k){
        if(arr[k] > arr[k+1]) {
            swapFlag = true;
            [arr[k], arr[k+1]] = [arr[k+1], arr[k]];
        }
    }
    if(!swapFlag) break;
}
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// 平均时间复杂度 O(n²) 最好情况 O(n) 最坏情况 O(n²) 空间复杂度 O(1) 稳定排序
```
#### 插入排序
``` js
var arr = [1, 7, 9, 8, 3, 2, 6, 0, 5, 4];
var n = arr.length;
for(let i=1; i<n; ++i){
    let preIndex = i-1;
    let current = arr[i];
    while(preIndex >= 0 && arr[preIndex] > current) {
        arr[preIndex+1] = arr[preIndex];
        --preIndex;
    }
    arr[preIndex+1] = current;
}
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// 平均时间复杂度 O(n²) 最好情况 O(n) 最坏情况 O(n²) 空间复杂度 O(1) 稳定排序
```
#### 快速排序
``` js
function partition(arr, start, end){
    var boundary = arr[start];
    while(start < end){
        while(start < end && arr[end] >= boundary) --end;
        arr[start] = arr[end];
        while(start < end && arr[start] <= boundary) ++start;
        arr[end] = arr[start];
    }
    arr[start] = boundary;
    return start;
}

function quickSort(arr, start, end){
    if(start >= end) return ;
    var boundaryIndex = partition(arr, start, end);
    quickSort(arr, start, boundaryIndex-1);
    quickSort(arr, boundaryIndex+1, end);
}


var arr = [1, 7, 9, 8, 3, 2, 6, 0, 5, 4];
quickSort(arr, 0, arr.length-1);
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// 平均时间复杂度 O(nlogn) 最好情况 O(nlogn) 最坏情况 O(n²) 空间复杂度 O(logn) 不稳定排序
```
#### 希尔排序
``` js
function shellSort(arr){
    var n = arr.length;
    for(let gap=n/2; gap>0; gap=Math.floor(gap/2)){
        for(let i=gap; i<n; ++i){
            for(let k=i-gap; k>=0 && arr[k]>arr[k+gap]; k=k-gap){
                [arr[k], arr[k+gap]] = [arr[k+gap], arr[k]];
            }
        }
    }
}

var arr = [1, 7, 9, 8, 3, 2, 6, 0, 5, 4];
shellSort(arr);
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// 平均时间复杂度 O(nlogn) 最好情况 O(nlog²n) 最坏情况 O(nlog²n) 空间复杂度 O(1) 不稳定排序
```
#### 堆排序
``` js
function adjustHeap(arr, i, n) {
    for(let k=2*i+1; k<n; k=2*k+1){
        let parent = arr[i];
        if(k+1 < n && arr[k] < arr[k+1]) ++k;
        if(parent < arr[k]){
            [arr[i], arr[k]] = [arr[k], arr[i]];
            i = k;
        }else{
            break;
        }
    }
}

function heapSort(arr) {
    var n = arr.length;
    for(let i = Math.floor(n/2-1); i>=0; --i) adjustHeap(arr, i, n);
    for(let i=n-1; i>0; --i){
        [arr[0], arr[i]] = [arr[i], arr[0]];
        adjustHeap(arr, 0, i);
    }
}

var arr = [1, 7, 9, 8, 3, 2, 6, 0, 5, 4];
heapSort(arr);
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// 平均时间复杂度 O(nlogn) 最好情况 O(nlogn) 最坏情况 O(nlogn) 空间复杂度 O(1) 不稳定排序
```
#### 归并排序
``` js
function merger(arr, start, mid, end, auxArr){
    var startStroage = start;
    var midRight = mid + 1;
    var count = 0;
    while(start <= mid && midRight <= end){
        if(arr[start] <= arr[midRight]) auxArr[count++] = arr[start++];
        else auxArr[count++] = arr[midRight++];
    }
    while(start<=mid) auxArr[count++] = arr[start++];
    while(midRight<=end) auxArr[count++] = arr[midRight++];
    for(let i=0; i<count; ++i) arr[i+startStroage] = auxArr[i];
    return arr;
}

function mergeSort(arr, start, end, auxArr) {
  if(start<end) {
    var mid = Math.floor((start+end)/2);
    var left = mergeSort(arr, start, mid, auxArr); 
    var right = mergeSort(arr, mid+1, end, auxArr); 
    arr = merger(arr, start, mid, end, auxArr);  
  }
  return arr;
}

var arr = [1, 7, 9, 8, 3, 2, 6, 0, 5, 4];
arr = mergeSort(arr, 0, arr.length-1, []);
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// 平均时间复杂度 O(nlogn) 最好情况 O(nlogn) 最坏情况 O(nlogn) 空间复杂度 O(n) 稳定排序
```
