'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        root.BannerArrows = factory();
    }
})(window, function () {

    var defaultSetting = {

        id: '',
        width: 0, // 当用div作为target元素时， 则使用div的长度和宽度
        height: 0,
        arrows: {
            numbers: 10, // 箭头数
            width: 100, // 箭头长度
            height: 10, // 箭头宽度
            margin: 1, // 箭头的间隔
            labels: [], // 对应的标签
            labelMargin: 1,
            activeIndex: -1 // 初始激活的索引值
        },
        style: { //样式
            // backgroundColor: '',
            arrowFillStyle: 'rgba(195,165,0,1)', // 箭头渲染的颜色
            arrowActiveStyle: 'rgba(295,65,0,1)', // 箭头激活的颜色
            textFont: '16px sans-serif', // 字体样式
            textColor: '#000', // 字体颜色
            textAlpha: 1.0 // 字体的透明度
        },
        events: {
            click: function click(labelText, index) {// 点击事件 提供两个参数 对应的标签值和索引值

            }
        }
    };

    var BannerArrows = function () {
        function BannerArrows(setting) {
            _classCallCheck(this, BannerArrows);

            this.setting = _extends({}, defaultSetting, setting);

            var element = document.getElementById(this.setting.id);

            this.canvas = element instanceof HTMLCanvasElement ? element : Util.appendCanvas2Target(element, Util.generatorUUId(), this.setting.width, this.setting.height);
            this.canvas.style.cursor = 'pointer';
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = this.canvas.height;

            this.arrowsSetting = _extends({}, defaultSetting.arrows, setting.arrows);

            this.styleSetting = _extends({}, defaultSetting.style, setting.style);

            this.events = _extends({}, defaultSetting.events, setting.events);

            this.vertexes = BannerArrows.createArrowVertex(this.arrowsSetting, this.styleSetting); // 绘画要用的数据集

            this.ctx = this.canvas.getContext('2d');

            var _this = this;

            this.canvas.addEventListener('click', function (e) {
                var position = Util.getEventPosition(e);
                var ctx = _this.ctx;
                var rect = _this.vertexes.rect;
                ctx.beginPath();
                ctx.rect(rect[0], rect[1], rect[2], rect[3]);
                if (!ctx.isPointInPath(position.x, position.y)) {
                    return;
                }

                ctx.clearRect(rect[0], rect[1], rect[2], rect[3]);

                var selectIndex = _this.draw(Util.getEventPosition(e));

                _this.vertexes.selecIndex = selectIndex;

                _this.events.click && _this.events.click(_this.arrowsSetting.labels[selectIndex], selectIndex);
            });
            this.draw();
        }

        _createClass(BannerArrows, [{
            key: 'draw',
            value: function draw(position) {

                var ctx = this.ctx,
                    vertexes = this.vertexes,
                    canvasWidth = this.canvasWidth,
                    canvasHeight = this.canvasHeight,
                    selectIndex = this.vertexes.activeIndex,
                    style = this.styleSetting;

                ctx.clearRect(0, 0, canvasWidth, canvasHeight);

                var inside = false;
                var rect = vertexes.rect;
                if (position) {
                    ctx.beginPath();
                    ctx.rect(rect[0], rect[1], rect[2], rect[3]);
                    inside = ctx.isPointInPath(position.x, position.y);

                    ctx.clearRect(rect[0], rect[1], rect[2], rect[3]);
                }

                vertexes.arrowVertexes.forEach(function (vertex, index) {
                    ctx.beginPath();
                    ctx.moveTo(vertex[1][0], vertex[1][1]);

                    for (var i = 2; i < vertex.length; i++) {
                        ctx.lineTo(vertex[i][0], vertex[i][1]);
                    }
                    ctx.closePath();
                    ctx.fillStyle = vertex[0];
                    if (position) {
                        if (ctx.isPointInPath(position.x, position.y)) {
                            ctx.fillStyle = style.arrowActiveStyle;
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
                var text = this.arrowsSetting.labels;
                if (text.length !== vertexes.arrowVertexes.length) {
                    return;
                }
                vertexes.textCenters.forEach(function (textCenter, index) {
                    ctx.beginPath();

                    var textData = ctx.measureText(text[index]);

                    ctx.fillStyle = selectIndex === index ? style.arrowActiveStyle : Util.hexToRgba(style.textColor, style.textAlpha);

                    ctx.fillText(text[index], textCenter[0] - textData.width / 2, textCenter[1] * 2 + 4);
                });

                return selectIndex;
            }

            /**
             *  生成Vertexes 的数据
             * @param arrowSetting
             * @param style
             * @returns {{rect: *[], arrowVertexes: Array, textCenters: Array}}
             */

        }], [{
            key: 'createArrowVertex',
            value: function createArrowVertex(arrowSetting, style) {

                var arrowVertexes = [];

                var textCenters = [];

                var w = 0;
                var margin = arrowSetting.margin,
                    width = arrowSetting.width,
                    textMargin = arrowSetting.labelMargin,
                    activeIndex = arrowSetting.activeIndex,
                    height = arrowSetting.height;
                for (var i = 0; i < arrowSetting.numbers; i++) {
                    var _arr = [];
                    _arr.push(i === activeIndex ? style.arrowActiveStyle : style.arrowFillStyle);
                    _arr.push([w + margin, margin]); // 起点
                    _arr.push([w + margin + width - 5, margin]); // 箭头上方点
                    _arr.push([w + margin + width, margin + height / 2]); // 箭头点
                    _arr.push([w + margin + width - 5, margin + height]); // 箭头下方点
                    _arr.push([w + margin, margin + height]); // 箭尾下方点
                    _arr.push([w + margin + 5, margin + height / 2]); // 箭尾凹点

                    arrowVertexes.push(_arr);
                    textCenters.push([width / 2 + margin + w, height + margin * 2 + textMargin]);
                    w += width + margin;
                }

                return {
                    rect: [0 + margin, margin, width * arrowSetting.numbers, height],
                    arrowVertexes: arrowVertexes,
                    activeIndex: activeIndex,
                    textCenters: textCenters
                };
            }
        }]);

        return BannerArrows;
    }();

    var Util = function () {
        function Util() {
            _classCallCheck(this, Util);
        }

        /**
         *  获取 鼠标点击canvas的位置
         * @param ev
         * @returns {{x: *, y: *}}
         */


        _createClass(Util, null, [{
            key: 'getEventPosition',
            value: function getEventPosition(ev) {
                var x = void 0,
                    y = void 0;
                if (ev.layerX || ev.layerX === 0) {
                    x = ev.layerX;
                    y = ev.layerY;
                } else if (ev.offsetX || ev.offsetX === 0) {
                    // Opera
                    x = ev.offsetX;
                    y = ev.offsetY;
                }
                return { x: x, y: y };
            }

            /**
             *  添加canvas标签
             * @param {HTMLElement|String} target
             * @param {String} id
             * @param {Number} width
             * @param {Number} height
             * @returns {HTMLElement}
             */

        }, {
            key: 'appendCanvas2Target',
            value: function appendCanvas2Target(target, id, width, height) {
                var divNode = target instanceof HTMLElement ? target : document.getElementById(target);

                var canvas = document.createElement('canvas');
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

        }, {
            key: 'generatorUUId',
            value: function generatorUUId() {
                return new Date().getTime().toString(16);
            }

            /**
             *  将hex颜色值转换为regba形式 支持hex 简写
             * @param hex
             * @param opacity
             * @returns {*}
             */

        }, {
            key: 'hexToRgba',
            value: function hexToRgba(hex) {
                var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

                if (hex.indexOf('rgba(') === 0) {
                    return hex;
                }

                if (hex.length === 4) {
                    hex = '#' + hex.slice(1).repeat(2);
                }
                return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
            }
        }]);

        return Util;
    }();

    return BannerArrows;
});