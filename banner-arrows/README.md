<h1>箭头旗帜</h1>

[点击返回](../README.md "点击返回")


### 浏览器支持
ie：ie8以上（ie8动画会有卡顿的情况出现）
chrome：支持html5-canvas的基本支持
其它浏览器： 未测试
<hr />

### api

1 new BannerArrows(*option*)
说明：根据传递的参数生成实例
```
    let ba = new BannerArrows(***option***);
```

***
### 参数
#### 初始化参数
- id[String]
说明：目前**div**或**canvas**的**id**值， 表示用来生成的环形进度条的位置
- width[Number]
说明：环形进度条的宽度， 未指明时，会采用目标div的width, 建议与height值一致
- height[Number]
说明：环形进度条的高度， 未指明时，会采用目标div的height, 建议与weight值一致
- arrows[Object]
说明：设置箭头的参数
```js
      arrows: {
          numbers : 10, // 箭头数
          width: 100, // 箭头长度
          height: 10, // 箭头宽度
          margin: 1, // 箭头的间隔
          labels: [], // 对应的标签
          labelMargin: 1,
          activeIndex: -1, // 初始激活的索引值
        },
```
- style[Object]
说明：样式
```js
 arrowFillStyle: 'rgba(195,165,0,1)', // 箭头渲染的颜色
            arrowActiveStyle: 'rgba(295,65,0,1)', // 箭头激活的颜色
            textFont: '16px sans-serif',  // 字体样式
            textColor: '#000',  // 字体颜色
            textAlpha: 1.0 // 字体的透明度
```
- events[Object]
说明： 事件(目前只支持click)
```
   events: {
            click: function (labelText, index) { // 点击事件 提供两个参数 对应的标签值和索引值

            }
        }
```
---
### 默认参数
```
  {

         id: '',
         width: 0, // 当用div作为target元素时， 则使用div的长度和宽度
         height: 0,
         arrows: {
           numbers : 10, // 箭头数
           width: 100, // 箭头长度
           height: 10, // 箭头宽度
           margin: 1, // 箭头的间隔
           labels: [], // 对应的标签
           labelMargin: 1,
           activeIndex: -1, // 初始激活的索引值
         },
         style: {  //样式
             // backgroundColor: '',
             arrowFillStyle: 'rgba(195,165,0,1)', // 箭头渲染的颜色
             arrowActiveStyle: 'rgba(295,65,0,1)', // 箭头激活的颜色
             textFont: '16px sans-serif',  // 字体样式
             textColor: '#000',  // 字体颜色
             textAlpha: 1.0 // 字体的透明度
         },
         events: {
             click: function (labelText, index) { // 点击事件 提供两个参数 对应的标签值和索引值

             }
         }
     }

```
---
### 示例
* default：
![](./resources/ba.png '描述')
