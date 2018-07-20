<h1>圆形进度条</h1>  
  
[点击返回](../README.md "点击返回")  


###浏览器支持 
ie：ie8以上（ie8动画会有卡顿的情况出现）  
chrome：支持html5-canvas的基本支持  
其它浏览器： 未测试
<hr />

###api
1 new circularProgress(*option*)     
说明：根据传递的参数生成实例      
```
    let cp = new circularProgress(***option***);
```  
  
2 setValue(*value*)  
说明：根据传递的参数设置的进度，value为整数数值型  
```
    let cp = new circularProgress(***option***).setValue(10);
```  

3 attach(*jquery*)
说明：将该方法扩展到jquery实例上,在jquery实例为$, JQuery, jquery时不需要手动执行  
```
    circularProgress.attach($); // $为jquery对象
    $('#test).circularProgress(*option*);
```

4 deviate(*jquery*)  
说明：将jquery上扩展的方法重新赋值之前的扩展方法，调用该方法后则无法使用jquery实例来生成circularProgress了  
```
    circularProgress.deviate($); // $为jquery对象
    $('#test).circularProgress(*option*); // throw new Error
```
***
### 参数
#### 初始化参数
- target[String]   
说明：目前***div***的***id***值， 表示用来生成的环形进度条的位置
- width[Number]  
说明：环形进度条的宽度， 未指明时，会采用目标div的width, 建议与height值一致
- height[Number]  
说明：环形进度条的高度， 未指明时，会采用目标div的height, 建议与weight值一致
- animate[Boolean]  
说明：是否采用动画效果
- formatText[Function]  
说明：设置中间文本时需要对文本处理的参数，默认输出数字+%号的文本
- style[Object]   
说明： 采用样式，未指明会采用默认样式
---
###style参数
```
 {
        background: { // 背景的设置  
            backgroundColor: '#000', // 背景颜色
            alpha: 1, // 透明度
            backgroundImage: '', // 背景图片， 如果有背景图片的话，则优先使用背景图片绘画（图片会压缩到canvas的实际大小）
            crossOrigin: false // 为域外背景时需要设置为true
        },
        ring: { //环的设置
            backgroundColor: '#cccccc', // 外环边框的背景色
            radius: 0, // 半径  // 设置为0时，会自动计算为两边最小值得0.45
            alpha: 0.7, // 透明度
            lineWidth: 2, // 外环边框的宽度
            fill: '' // 设置圆环内部填充颜色
        },
        progress: { // 进度条的设置
            color: '#FF8C00', // 进度条的颜色
            radius: 0, // 半径
            alpha: 1, // 透明度
            lineWidth: 4, // 进度条的宽度
        },
        text: { // 文本的设置
            font: '20px sans-serif', // 文本的样式
            color: '#000000', // 颜色
            alpha: 1.0 // 透明度
        }
      }
      
```
