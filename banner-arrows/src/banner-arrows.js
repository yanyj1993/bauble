(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.BannerArrows = factory();
    }
})(window, function() {



    let defaultSetting = {

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
    };



    class BannerArrows {

        constructor(setting) {

            this.setting = {...defaultSetting, ...setting};

            let element = document.getElementById(this.setting.id);

            this.canvas =  element instanceof HTMLCanvasElement ?
                element
                :
                Util.appendCanvas2Target(element, Util.generatorUUId(), this.setting.width, this.setting.height);
            this.canvas.style.cursor = 'pointer';
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = this.canvas.height;

            this.arrowsSetting = {...defaultSetting.arrows, ...setting.arrows};

            this.styleSetting = {...defaultSetting.style, ...setting.style};

            this.events = {...defaultSetting.events, ...setting.events};

            this.vertexes = BannerArrows.createArrowVertex(this.arrowsSetting, this.styleSetting); // 绘画要用的数据集

            this.ctx = this.canvas.getContext('2d');

            let _this = this;
            
            this.canvas.addEventListener('click', function (e) {
                let position = Util.getEventPosition(e);
                let ctx = _this.ctx;
                let rect = _this.vertexes.rect;
                ctx.beginPath();
                ctx.rect(rect[0], rect[1], rect[2], rect[3]);
                if( !ctx.isPointInPath(position.x, position.y)) {
                    return ;
                }

                ctx.clearRect(rect[0], rect[1], rect[2], rect[3]);

                let selectIndex = _this.draw(Util.getEventPosition(e));

                _this.vertexes.selecIndex = selectIndex;

                _this.events.click && _this.events.click(_this.arrowsSetting.labels[selectIndex], selectIndex);
            })
            this.draw();
        }
        

        draw(position) {

            let ctx = this.ctx,
                vertexes = this.vertexes,
                canvasWidth = this.canvasWidth,
                canvasHeight = this.canvasHeight,
                selectIndex = this.vertexes.activeIndex,
                style = this.styleSetting;

            ctx.clearRect(0,0,canvasWidth,canvasHeight);

            let inside = false;
            let rect = vertexes.rect;
            if(position) {
                ctx.beginPath();
                ctx.rect(rect[0], rect[1], rect[2], rect[3]);
                inside = ctx.isPointInPath(position.x, position.y);

                ctx.clearRect(rect[0], rect[1], rect[2], rect[3]);
            }


            vertexes.arrowVertexes.forEach((vertex, index) => {
                ctx.beginPath();
                ctx.moveTo(vertex[1][0], vertex[1][1]);

                for(let i = 2; i < vertex .length; i++) {
                    ctx.lineTo(vertex[i][0], vertex[i][1]);
                }
                ctx.closePath();
                ctx.fillStyle = vertex[0];
                if(position) {
                    if(ctx.isPointInPath(position.x, position.y)) {
                        ctx.fillStyle  = style.arrowActiveStyle;
                        selectIndex = index;
                    } else {
                        ctx.fillStyle = style.arrowFillStyle;
                    }
                    vertex[0] = ctx.fillStyle;

                }

                ctx.fill();
            });


            ctx.font = style.textFont;
            ctx.textAlign = "start";
            let text = this.arrowsSetting.labels;
            if(text.length !== vertexes.arrowVertexes.length) {
                return
            }
            vertexes.textCenters.forEach((textCenter, index) => {
                ctx.beginPath();

                let textData = ctx.measureText(text[index]);

                ctx.fillStyle = (selectIndex === index ? style.arrowActiveStyle : Util.hexToRgba(style.textColor, style.textAlpha));

                ctx.fillText(text[index], textCenter[0] - textData.width/2, textCenter[1] *2 + 4);


            });

            return selectIndex;
        }


        /**
         *  生成Vertexes 的数据
         * @param arrowSetting
         * @param style
         * @returns {{rect: *[], arrowVertexes: Array, textCenters: Array}}
         */
        static createArrowVertex(arrowSetting, style) {

            let arrowVertexes = [];

            let textCenters = [];

            let w = 0;
            let margin = arrowSetting.margin,
                width = arrowSetting.width,
                textMargin = arrowSetting.labelMargin,
                activeIndex = arrowSetting.activeIndex,
                height = arrowSetting.height;
            for(let i = 0; i < arrowSetting.numbers; i++) {
                let _arr = [];
                _arr.push(i === activeIndex ? style.arrowActiveStyle : style.arrowFillStyle);
                _arr.push([w + margin, margin]); // 起点
                _arr.push([w + margin + width - 5, margin]); // 箭头上方点
                _arr.push([w + margin + width, margin + height / 2]); // 箭头点
                _arr.push([w + margin + width - 5, margin + height ]); // 箭头下方点
                _arr.push([w + margin, margin + height ]); // 箭尾下方点
                _arr.push([w + margin + 5, margin + height /2 ]); // 箭尾凹点

                arrowVertexes.push(_arr);
                textCenters.push([width / 2 + margin + w, height + margin * 2 + textMargin]);
                w += width + margin;

            }


            return {
                rect: [0 + margin, margin, width * arrowSetting.numbers, height],
                arrowVertexes,
                activeIndex,
                textCenters
            };


        }


    }



    class Util {
        constructor() {

        }

        /**
         *  获取 鼠标点击canvas的位置
         * @param ev
         * @returns {{x: *, y: *}}
         */
        static getEventPosition(ev){
            let x, y;
            if (ev.layerX || ev.layerX === 0) {
                x = ev.layerX;
                y = ev.layerY;
            }else if (ev.offsetX || ev.offsetX === 0) { // Opera
                x = ev.offsetX;
                y = ev.offsetY;
            }
            return {x: x, y: y};
        }

        /**
         *  添加canvas标签
         * @param {HTMLElement|String} target
         * @param {String} id
         * @param {Number} width
         * @param {Number} height
         * @returns {HTMLElement}
         */
        static appendCanvas2Target(target, id, width, height) {
            let divNode = target instanceof HTMLElement ? target : document.getElementById(target);

            let canvas = document.createElement('canvas');
            canvas.id = id;
            canvas.width = width || divNode.offsetWidth;
            canvas.height = height || divNode.offsetHeight;

            divNode.appendChild(canvas);

            return canvas;
        }

        /**
         *  自动生成uuid
         * @returns {string}
         */
        static generatorUUId() {
            return new Date().getTime().toString(16);
        }

        /**
         *  将hex颜色值转换为regba形式 支持hex 简写
         * @param hex
         * @param opacity
         * @returns {*}
         */
        static hexToRgba(hex, opacity = 1) {
            if (hex.indexOf('rgba(') === 0) {
                return hex;
            }

            if(hex.length === 4) {
                hex = '#' + hex.slice(1).repeat(2);
            }
            return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
        }
    }




    return BannerArrows;

});