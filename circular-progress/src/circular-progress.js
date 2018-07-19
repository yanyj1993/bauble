(function (root, factory) {

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
        root.circularProgress = factory();
    }
})(window, function () {

    // bind
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fBound = function () {
                console.log("21:53", fBound, this, this instanceof fBound);
                return fToBind.apply(this instanceof fBound
                    ? this
                    : oThis,
                    // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fBound.prototype = this.prototype; //直接赋值prototype

        return fBound;
    };


    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    window.cancelAnimationFrame = window.cancelAnimationFrame ||clearTimeout;

    //检测是否支持canvas
    if (!document.createElement('canvas').getContext) {
        // 使用阻塞的方法加载
        document.write('<script src="../dist/canvas-ployfill/html5.js"></script>');
        document.write('<script src="../dist/canvas-ployfill/excanvas.js"></script>');
    }

    let circularProgress = function (option = {target: 'circularProgress', animate: true, style: {}, steep: 1}) {
        this.div = document.getElementById(option.target);
        this.canvasWidth = option.width || parseInt(this.div.style.width);
        this.canvasHeight = option.height || parseInt(this.div.style.height);

        this.canvas = document.getElementById(`cp-canvas-${appendCanvas(this.div, this.canvasWidth, this.canvasHeight)}`);
        if (!this.canvas.getContext) {
            G_vmlCanvasManager.initElement(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');
        this.style = option.style || {};
        this.steep = option.steep || 1;
        this.value = 0;
        this.animate = option.animate;
        this.targetValue = 0;
        this.formatText = option.formatText || function (value) {
            return parseFloat(value + '').toFixed(0) + '%';
        };
        return this;
    };

    let appendCanvas = function (div, width, height) {
        let id = generatorId();
        div.innerHTML = `<canvas id="cp-canvas-${id}" width="${width}" height="${height}"></canvas>`;

        return id;
    };


    circularProgress.styles = {
        'default': {
            background: { // 背景的设置
                backgroundColor: '#000',
                alpha: 1, // 透明度
                backgroundImage: '', // 背景图片， 如果有背景图片的话，则优先使用背景图片绘画（图片会压缩到canvas的实际大小）
                crossOrigin: false
            },

            ring: { //环的设置
                backgroundColor: '#cccccc',
                radius: 0, // 半径
                alpha: 0.7,
                lineWidth: 2,
                fill: '' // 设置圆环内部填充颜色
            },

            progress: { // 进度条的设置
                color: '#FF8C00',
                radius: 0, // 半径
                alpha: 1,
                lineWidth: 4,
            },

            text: { // 文本的设置
                font: '20px sans-serif',
                color: '#000000',
                alpha: 1.0
            }

        }
    };

    circularProgress.prototype.draw = function (targetValue) {
        this.targetValue = targetValue;

        let style = this.style;
        let ctx = this.ctx;
        let canvasWidth = this.canvasWidth;
        let canvasHeight = this.canvasHeight;
        let formatText = this.formatText;
        if (this.animate) {
            // 动画
            this.value += this.steep;

            let value = this.value;

            if (this.targetValue >= this.value) {
                this.clear();
                drawBackground(ctx, {...circularProgress.styles['default'].background, ...style.background}, canvasWidth, canvasHeight, function () {
                    drawRing(ctx, canvasWidth, canvasHeight, {...circularProgress.styles['default'].ring, ...style.ring});
                    if (value !== void 0) {
                        drawText(ctx, formatText(value), {...circularProgress.styles['default'].text, ...style.text}, canvasWidth, canvasHeight);
                        drawProgress(ctx, +parseFloat(value).toFixed(0), {...circularProgress.styles['default'].progress, ...style.progress}, canvasWidth, canvasHeight)
                    }
                });
            } else {
                this.value = this.targetValue;
            }
            this.animateNumber = requestAnimationFrame(this.draw.bind(this, targetValue));
        } else {
            // 非动画
            this.clear();
            drawBackground(ctx, {...circularProgress.styles['default'].background, ...style.background}, canvasWidth, canvasHeight, function () {
                drawRing(ctx, canvasWidth, canvasHeight, {...circularProgress.styles['default'].ring, ...style.ring});
                if (targetValue !== void 0) {
                    drawText(ctx, formatText(targetValue), {...circularProgress.styles['default'].text, ...style.text}, canvasWidth, canvasHeight);
                    drawProgress(ctx, +parseFloat(targetValue).toFixed(0), {...circularProgress.styles['default'].progress, ...style.progress}, canvasWidth, canvasHeight)
                }
            });
        }


        return this;
    };

    circularProgress.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        return this;
    };

    circularProgress.prototype.setValue = function (value) {
        if (value < this.value) {

            this.value = 0;
        }
        if (this.animateNumber) {
            cancelAnimationFrame(this.animateNumber);
        }
        this.draw(value);

        return this;
    };

    // drawBackground

    let drawBackground = (ctx, style, width, height, callback) => {

        ctx.save();
        ctx.beginPath();

        // ctx.globalAlpha = style.alpha || 1.0; // 设置透明度
        if (!!style.backgroundImage) {
            // 绘背景图片
            let image = new Image();
            image.src = style.backgroundImage;

            if (style.crossOrigin) {
                image.crossOrigin = 'Anonymous'
            }
            image.onload = function () {
                ctx.drawImage(image, 0, 0, width, height);
                let imgData = ctx.getImageData(0, 0, image.width, image.height);
                for (let i = 0, len = imgData.data.length; i < len; i += 4) {
                    // 改变每个像素的透明度
                    imgData.data[i + 3] = imgData.data[i + 3] * style.alpha;
                }
                // 将获取的图片数据放回去。
                ctx.putImageData(imgData, 0, 0);
                callback && callback();
            }


        } else {
            // 绘背景色
            ctx.fillStyle = style.backgroundColor || '#000';

            ctx.rect(0, 0, width, height);

            ctx.fill();
            callback && callback();
        }


    };

    // 画圆
    let drawRing = function (ctx, width, height, style) {

        let radius = 0;
        if (style.radius !== 0) {
            radius = style.radius;
        } else {
            radius = width > height ? height * 0.9 * 0.5 : width * 0.9 * 0.5;
        }
        // ctx.globalAlpha = style.alpha || 1.0;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = hexToRgba(style.fill, style.alpha);
        ctx.arc(width / 2, height / 2, radius - style.lineWidth, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.strokeStyle = hexToRgba(style.backgroundColor, style.alpha);
        ctx.lineWidth = style.lineWidth;
        // ctx.(width/2, height/2, style.radius, 0, Math.PI*2,false);
        ctx.stroke();

        ctx.restore();
    };


    // 画文本， 默认画当前进度值
    let drawText = function (ctx, text, style, width, height) {
        ctx.save();
        ctx.font = style.font;
        ctx.textAlign = "start";
        let textData = ctx.measureText(text);


        ctx.fillStyle = hexToRgba(style.color, style.alpha);

        ctx.fillText(text, width / 2 - textData.width / 2, height / 2 + 7);

        ctx.restore();
    };

    // 画进度条
    let drawProgress = function (ctx, value, style, width, height) {
        let progress = Math.PI * 2 / 100;
        let radius = width > height ? height * 0.9 * 0.5 : width * 0.9 * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = hexToRgba(style.color, style.alpha);
        ctx.lineWidth = style.lineWidth;

        ctx.arc(width / 2, height / 2, radius - style.lineWidth / 2, -Math.PI / 2, -Math.PI / 2 + progress * value, false);

        ctx.stroke();

        ctx.restore();
    };

    let primaryMethod = void 0;
    let noExtend = false;
    // jquery 扩展用
    circularProgress.attach = (_jquery) => {
        if (_jquery.fn.hasOwnProperty('circularProgress')) {
            primaryMethod = _jquery.fn.circularProgress;
        } else {
            noExtend = true;
        }

        _jquery.fn.extend({
            circularProgress: function (option = {}) {
                option.target = _jquery(this).attr('id');
                return new circularProgress(option);
            }
        });
    };


    // deviate
    circularProgress.deviate = (_jquery) => {

        if (noExtend) {
            delete _jquery.fn.circularProgress
        } else {
            _jquery.fn.extend({
                circularProgress: primaryMethod
            });
        }

        noExtend = false;
    };

    // 16进制转rgba
    function hexToRgba(hex, opacity) {
        if (hex.indexOf('rgba(') === 0) {
            return hex;
        }
        return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
    }

    // 自动扩展
    try {
        if (!!$) {
            circularProgress.attach($);
        } else if (!!jquery) {
            circularProgress.attach(jquery);
        } else if (!!JQuery) {
            circularProgress.attach(JQuery);
        } else {
            console.warn('未找到jquery对象， 请手动执行circularProgress.attach 方法进行jquery扩展');
        }
    } catch (e) {
        console.warn('未找到jquery对象， 请手动执行circularProgress.attach 方法进行jquery扩展');
    }


    let generatorId = () => new Date().getTime().toString(16);
    return circularProgress;
});