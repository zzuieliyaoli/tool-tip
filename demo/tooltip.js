window.onload = function() {

    //享元模式
    // 所有的tooltip公用一个Tooltip实例
    var TooltipManager = (function() {
        var storedInstance = null;
        var Tooltip = function() {
            //默认参数
            var config = {
                delay: 50,
                tooltipText: "tooltip",
                place: "top"
            }
            this.delayTimeout = null;
            this.updateDefault(config);
            this.appendToolTip();
        };

        Tooltip.prototype = {
            constructor: Tooltip,
            
            startDelay: function(targetElement, event, text, para) {
                if (this.delayTimeout == null) {
                    var that = this;
                    var x = this.getElementOffset(targetElement).Left;
                    var y = this.getElementOffset(targetElement).Top;

                    //若有自定义有参数，则使用
                    //若没有，则使用默认参数
                    text = text || this.tooltipText;
                    this.place = para.place || this.place;

                    this.delayTimeout = setTimeout(function() {
                        that.show(targetElement, x, y, text, para);
                    }, para.delay || that.delay);
                }
            },
            show: function(targetElement, x, y, text, para) {
                clearTimeout(this.delayTimeout);
                this.delayTimeout = null;

                this.element.position = "absolute";
                this.element.style.display = "inline-block";

                this.elementText.innerHTML = text;


                var targetElementOffsetWidth = this.getElementOffset(targetElement).Width;
                var targetElementOffsetHeight = this.getElementOffset(targetElement).Height;

                var tooltipOffsetWidth = this.getElementOffset(this.element).Width;
                var tooltipOffsetHeight = this.getElementOffset(this.element).Height;

                var tooltipTextOffsetHeight = this.getElementOffset(this.elementText).Height;
                var tooltipTextOffsetWidth = this.getElementOffset(this.elementText).Width;

                var widthDifference = targetElementOffsetWidth - tooltipOffsetWidth;
                var heightDifference = targetElementOffsetHeight - tooltipOffsetHeight;

                switch (this.place) {
                    case "left":
                        {   
                            //8为箭头长度，下同
                            y = y + heightDifference / 2;
                            x = x - tooltipTextOffsetWidth - 8;
                            this.elementArrow.className = "arrow" + " left";
                            break;
                        }
                    case "top":
                        {   
                            x = x + widthDifference / 2;
                            y = y - tooltipOffsetHeight - 8;
                            this.elementArrow.className = "arrow" + " top";
                            break;
                        }
                    case "right":
                        {
                            y = y + heightDifference / 2;
                            x = x + targetElementOffsetWidth + 8;
                            this.elementArrow.className = "arrow" + " right";
                            break;
                        }
                    case "bottom":
                        {
                            x = x + widthDifference / 2;
                            y = y + targetElementOffsetHeight + 8 ;
                            this.elementArrow.className = "arrow" + " bottom";
                            break;
                        }

                }
                this.element.style.left = x + "px";
                this.element.style.top = y + "px";

            },
            hide: function() {
                clearTimeout(this.delayTimeout);
                this.delayTimeout = null;
                this.element.style.display = "none";
            },
            updateDefault: function(para) {
                for (var key in para) {
                    this[key] = para[key];
                }
            },
            appendToolTip: function() {
                //创建tooltip结构
                this.element = document.createElement("div");
                this.element.style.display = "none";
                this.element.style.position = "absolute";
                this.element.className = "tooltip";

                this.elementText = document.createElement("div");
                this.elementText.className = "text";
                this.elementArrow = document.createElement("div");
                this.elementArrow.className = "arrow";

                this.element.appendChild(this.elementText);
                this.element.appendChild(this.elementArrow);

                document.getElementsByTagName("body")[0].appendChild(this.element);
            },
            
            getElementOffset: function(element) {
                var actual = {
                    Left: element.offsetLeft,
                    Top: element.offsetTop,
                    Width: element.offsetWidth,
                    Height: element.offsetHeight
                }
                var current = element.offsetParent;
                while (current !== null) {
                    actual.Left += current.offsetLeft;
                    actual.Top += current.offsetTop;
                    current = current.offsetParent;
                }
                return actual;
            },
            addEvent: function(element, event, listener) {
                if (element.addEventListener) {
                    element.addEventListener(event, listener, false);
                    this.addEvent = function(element, event, listener) {
                        element.addEventListener(event, listener, false);
                    }
                } else if (element.attachEvent) {
                    element.attachEvent("on" + event, listener);
                    this.addEvent = function(element, event, listener) {
                        element.attachEvent("on" + event, listener);
                    }
                } else {
                    element["on" + type] = listener;
                    this.addEvent = function(element, event, listener) {
                        element["on" + type] = listener;
                    }
                }
            }
        };

        return {
            addToolTip: function(targetElement, text, para) {
                var tt = this.getTooltip();
                tt.addEvent(targetElement, "mouseover", function(event) {
                    tt.startDelay(targetElement, event, text, para);
                });
                tt.addEvent(targetElement, "mouseout", function(event) {
                    tt.hide();
                });
            },
            //惰性创建实例
            getTooltip: function() {
                if (storedInstance == null) {
                    storedInstance = new Tooltip();
                }
                return storedInstance;
            }
        }
    })();

    var ttTop = document.querySelector("div#tt-top");
    var ttRight = document.querySelector("div#tt-right");
    var ttBottom = document.querySelector("div#tt-bottom");
    var ttLeft = document.querySelector("div#tt-left");

    TooltipManager.addToolTip(ttLeft, "床前明月光", {
        delay: 300,
        place: "left"
    });
    TooltipManager.addToolTip(ttTop, "You're so much bigger than the world I've made", {
        delay: 50,
        place: "top"
    });
    TooltipManager.addToolTip(ttBottom, "不如自挂东南枝", {
        delay: 250,
        place: "bottom"

    });
    TooltipManager.addToolTip(ttRight, "不忘初心", {
        delay: 100,
        place: "right"
    });
    

};