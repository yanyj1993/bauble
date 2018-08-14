'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define([], factory);
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
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
            fBound = function fBound() {
            return fToBind.apply(this instanceof fBound ? this : oThis,
            // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
            aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fBound.prototype = this.prototype; //直接赋值prototype

        return fBound;
    };

    if (!String.prototype.repeat) {
        String.prototype.repeat = function (count) {
            'use strict';

            if (this == null) {
                throw new TypeError('can\'t convert ' + this + ' to object');
            }
            var str = '' + this;
            count = +count;
            if (count != count) {
                count = 0;
            }
            if (count < 0) {
                throw new RangeError('repeat count must be non-negative');
            }
            if (count == Infinity) {
                throw new RangeError('repeat count must be less than infinity');
            }
            count = Math.floor(count);
            if (str.length == 0 || count == 0) {
                return '';
            }
            // 确保 count 是一个 31 位的整数。这样我们就可以使用如下优化的算法。
            // 当前（2014年8月），绝大多数浏览器都不能支持 1 << 28 长的字符串，所以：
            if (str.length * count >= 1 << 28) {
                throw new RangeError('repeat count must not overflow maximum string size');
            }
            var rpt = '';
            for (;;) {
                if ((count & 1) == 1) {
                    rpt += str;
                }
                count >>>= 1;
                if (count == 0) {
                    break;
                }
                str += str;
            }
            return rpt;
        };
    }

    window.requestAnimationFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    }();

    window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

    //检测是否支持canvas
    if (!document.createElement('canvas').getContext) {
        // 使用阻塞的方法加载
        document.write('<script src="../dist/canvas-ployfill/html5.js"></script>');
        document.write('<script src="../dist/canvas-ployfill/excanvas.js"></script>');
    }

    var _circularProgress = function _circularProgress() {
        var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { target: 'circularProgress', animate: true, style: {}, steep: 1 };

        this.div = document.getElementById(option.target);
        this.canvasWidth = option.width || parseInt(this.div.style.width);
        this.canvasHeight = option.height || parseInt(this.div.style.height);

        this.canvas = document.getElementById('cp-canvas-' + appendCanvas(this.div, this.canvasWidth, this.canvasHeight));
        if (!this.canvas.getContext) {
            G_vmlCanvasManager.initElement(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');
        this.baseStyle = _circularProgress.styles['default'];
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

    var appendCanvas = function appendCanvas(div, width, height) {
        var id = generatorId();
        // 用来检测生成的id是否已存在
        while (!!document.getElementById('cp-canvas-' + id)) {
            id = generatorId();
        }
        div.innerHTML = '<canvas id="cp-canvas-' + id + '" width="' + width + '" height="' + height + '"></canvas>';

        return id;
    };

    _circularProgress.styles = {
        'default': {
            background: { // 背景的设置
                backgroundColor: '#000',
                alpha: 0, // 透明度
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
                lineWidth: 4
            },

            text: { // 文本的设置
                font: '20px sans-serif',
                color: '#000000',
                alpha: 1.0
            }

        },

        'blue-light': {
            background: { // 背景的设置
                backgroundColor: '#092a34',
                alpha: 1, // 透明度
                backgroundImage: '', // 背景图片， 如果有背景图片的话，则优先使用背景图片绘画（图片会压缩到canvas的实际大小）
                crossOrigin: false
            },
            ring: { //环的设置
                backgroundColor: '#cccccc',
                radius: 0, // 半径
                alpha: 0.1,
                lineWidth: 1,
                fill: '' // 设置圆环内部填充颜色
            },

            progress: { // 进度条的设置
                color: '#38b396',
                radius: 0, // 半径
                alpha: 1,
                lineWidth: 2
            },
            endPoint: {
                color: '#fff',
                radius: '1' // 半径
            },

            text: { // 文本的设置
                font: '20px sans-serif',
                color: '#fff',
                alpha: 1.0
            }
        },
        // 彩虹
        'grad': {
            background: { // 背景的设置
                backgroundColor: '#fff',
                alpha: 0, // 透明度
                backgroundImage: '', // 背景图片， 如果有背景图片的话，则优先使用背景图片绘画（图片会压缩到canvas的实际大小）
                crossOrigin: false
            },
            ring: { //环的设置
                backgroundColor: '#cccccc',
                radius: 0, // 半径
                alpha: 0.1,
                lineWidth: 1,
                fill: '' // 设置圆环内部填充颜色

            },

            progress: { // 进度条的设置
                color: '#38b396',
                radius: 0, // 半径
                alpha: 1,
                lineWidth: 2,
                grad: true,
                gradColor: ['red', 'blue', 'red']
            },

            text: { // 文本的设置
                font: '20px sans-serif',
                color: '#000',
                alpha: 1.0,
                grad: true,

                gradColor: ['orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'red'] // Red, Orange, Yellow, Green, Blue, Indigo and Violet
            }

        }
    };

    // set style Theme
    _circularProgress.prototype.setBaseStyle = function (name, style) {
        if (!!style) {
            _circularProgress.styles[name] = style;
        }

        this.baseStyle = _circularProgress.styles[name];

        return this;
    };

    _circularProgress.prototype.draw = function (targetValue) {
        this.targetValue = targetValue;

        var style = this.style;
        var ctx = this.ctx;
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var formatText = this.formatText;

        var baseStyle = this.baseStyle;
        if (this.animate) {
            // 动画
            this.value += this.steep;

            var value = this.value;

            if (this.targetValue >= this.value) {
                this.clear();
                drawBackground(ctx, _extends({}, baseStyle.background, style.background), canvasWidth, canvasHeight, function () {
                    drawRing(ctx, canvasWidth, canvasHeight, _extends({}, baseStyle.ring, style.ring));
                    if (value !== void 0) {
                        drawText(ctx, formatText(value), _extends({}, baseStyle.text, style.text), canvasWidth, canvasHeight);
                        drawProgress(ctx, +parseFloat(value).toFixed(0), _extends({}, baseStyle.progress, style.progress), canvasWidth, canvasHeight);
                    }
                });
            } else {
                this.value = this.targetValue;
            }
            this.animateNumber = requestAnimationFrame(this.draw.bind(this, targetValue));
        } else {
            // 非动画
            this.clear();
            drawBackground(ctx, _extends({}, baseStyle.background, style.background), canvasWidth, canvasHeight, function () {
                drawRing(ctx, canvasWidth, canvasHeight, _extends({}, baseStyle.ring, style.ring));
                if (targetValue !== void 0) {
                    drawText(ctx, formatText(targetValue), _extends({}, baseStyle.text, style.text), canvasWidth, canvasHeight);
                    drawProgress(ctx, +parseFloat(targetValue).toFixed(0), _extends({}, baseStyle.progress, style.progress), canvasWidth, canvasHeight);
                }
            });
        }

        return this;
    };

    _circularProgress.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        return this;
    };

    _circularProgress.prototype.setValue = function (value) {
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

    var drawBackground = function drawBackground(ctx, style, width, height, callback) {

        ctx.save();
        ctx.beginPath();

        // ctx.globalAlpha = style.alpha || 1.0; // 设置透明度
        if (!!style.backgroundImage) {
            // 绘背景图片
            var image = new Image();
            image.src = style.backgroundImage;

            if (style.crossOrigin) {
                image.crossOrigin = 'Anonymous';
            }
            image.onload = function () {
                ctx.drawImage(image, 0, 0, width, height);
                var imgData = ctx.getImageData(0, 0, image.width, image.height);
                for (var i = 0, len = imgData.data.length; i < len; i += 4) {
                    // 改变每个像素的透明度
                    imgData.data[i + 3] = imgData.data[i + 3] * style.alpha;
                }
                // 将获取的图片数据放回去。
                ctx.putImageData(imgData, 0, 0);
                callback && callback();
            };
        } else {
            // 绘背景色
            ctx.fillStyle = hexToRgba(style.backgroundColor || '#000', style.alpha);

            ctx.rect(0, 0, width, height);

            ctx.fill();
            callback && callback();
        }
    };

    // 画圆
    var drawRing = function drawRing(ctx, width, height, style) {

        var radius = 0;
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

    // 画文本， 默认画当前进度值1
    var drawText = function drawText(ctx, text, style, width, height) {
        ctx.save();
        ctx.font = style.font;
        ctx.textAlign = "start";
        var textData = ctx.measureText(text);

        if (style.grad) {
            var grad = ctx.createLinearGradient(0, 0, width, 0);
            var steep = 1.0 / style.gradColor.length;
            for (var i = 0; i < style.gradColor.length; i++) {
                grad.addColorStop(i * steep, style.gradColor[i]);
            }
            ctx.strokeStyle = grad;
            ctx.strokeText(text, width / 2 - textData.width / 2, height / 2 + 7);
        } else {
            ctx.fillStyle = hexToRgba(style.color, style.alpha);

            ctx.fillText(text, width / 2 - textData.width / 2, height / 2 + 7);
        }

        ctx.restore();
    };

    // 画进度条
    var drawProgress = function drawProgress(ctx, value, style, width, height) {
        var progress = Math.PI * 2 / 100;
        var radius = width > height ? height * 0.9 * 0.5 : width * 0.9 * 0.5;
        ctx.save();
        ctx.beginPath();
        // 渐变
        if (style.grad) {
            var grad = ctx.createLinearGradient(0, 0, width, 0);
            for (var i = 0; i < style.gradColor.length; i++) {
                grad.addColorStop(i * 0.5, style.gradColor[i]);
            }
            ctx.strokeStyle = grad;
        } else {
            ctx.strokeStyle = hexToRgba(style.color, style.alpha);
        }

        ctx.lineWidth = style.lineWidth;

        ctx.arc(width / 2, height / 2, radius - style.lineWidth / 2, -Math.PI / 2, -Math.PI / 2 + progress * value, false);

        ctx.stroke();

        ctx.restore();
    };

    var primaryMethod = void 0;
    var noExtend = false;
    // jquery 扩展用
    _circularProgress.attach = function (_jquery) {
        if (_jquery.fn.hasOwnProperty('circularProgress')) {
            primaryMethod = _jquery.fn.circularProgress;
        } else {
            noExtend = true;
        }

        _jquery.fn.extend({
            circularProgress: function circularProgress() {
                var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                option.target = _jquery(this).attr('id');
                return new _circularProgress(option);
            }
        });
    };

    // deviate
    _circularProgress.deviate = function (_jquery) {

        if (noExtend) {
            delete _jquery.fn.circularProgress;
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

        if (hex.length === 4) {
            hex = '#' + hex.slice(1).repeat(2);
        }
        return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
    }

    // 自动扩展
    try {
        if (!!$) {
            _circularProgress.attach($);
        } else if (!!jquery) {
            _circularProgress.attach(jquery);
        } else if (!!JQuery) {
            _circularProgress.attach(JQuery);
        } else {
            console.warn('未找到jquery对象， 请手动执行circularProgress.attach 方法进行jquery扩展');
        }
    } catch (e) {
        console.warn('未找到jquery对象， 请手动执行circularProgress.attach 方法进行jquery扩展');
    }

    var generatorId = function generatorId() {
        return new Date().getTime().toString(16);
    };
    return _circularProgress;
});