function WeiboScroll(o) {
    this._o = o;
    if (typeof WeiboScroll.prototype._initialized == "undefined") {
        WeiboScroll.prototype.Scrolled = function () {
            var _self = this;
            if (_self._o.find("li").length > 1) {
                _self._o.hover(function () {
                    $(this).attr("ishover", "hovered"); //鼠标经过设置ul的name值为"hovered"
                }, function () {
                    $(this).removeAttr("ishover");
                });

                if (_self._o.attr("ishover") != "hovered") {
                    //判断ul的name属性是否为"hovered"，决定下面代码块是否运行，以实现鼠标经过暂停滚动。
                    //var isIE6 = $.browser.msie && ($.browser.version=="6.0");
                    var isIE6 = false;
                    var height = _self._o.find("li:last").height();
                    if (isIE6) {
                        //判断IE6，jQuery的animate动画和opacity透明在一起使用在IE6中会出现中文重影现象，
                        //所以在ie6中实行透明的禁用。
                        _self._o.find("li:last").css({ "height": 0 });
                    } else {
                        _self._o.find("li:last").css({ "opacity": 0, "height": 0 });
                        //列表最后的li透明和高度设置为0 }
                        _self._o.find("li:first").before(_self._o.find("li:last"));
                        //把列表最后的li提升到顶部，实现有限列表项无限循环滚动显示
                        _self._o.find("li:first").animate({ "height": height }, 300);
                        //列表顶部的li高度逐渐变高以把下面的li推下去 if(!isIE6){
                        _self._o.find("li:first").animate({ "opacity": "1" }, 300);
                        //在非IE6浏览器中设置透明淡入效果
                    }
                }
                setTimeout(function () { _self.Scrolled(_self._o) }, 5000);
            }
        }
        WeiboScroll._initialized = true;
    }
}
//图片从右向左滚动-add by guowei-20160321
function RLScroll(o) {
    this._o = o;
    if (typeof RLScroll.prototype._initialized == "undefined") {
        RLScroll.prototype.Scrolled = function () {
            var _self = this;
            if (_self._o.find("li").length > 1) {
                _self._o.hover(function () {
                    $(this).attr("ishover", "hovered"); //鼠标经过设置ul的name值为"hovered"
                }, function () {
                    $(this).removeAttr("ishover");
                });

                if (_self._o.attr("ishover") != "hovered") {
                    //判断ul的name属性是否为"hovered"，决定下面代码块是否运行，以实现鼠标经过暂停滚动。
                    //var isIE6 = $.browser.msie && ($.browser.version=="6.0");
                    var isIE6 = false;
                    var width = _self._o.find("li:last").width();
                    if (isIE6) {
                        //判断IE6，jQuery的animate动画和opacity透明在一起使用在IE6中会出现中文重影现象，
                        //所以在ie6中实行透明的禁用。
                        _self._o.find("li:first").css({ "width": 0 });
                    } else {
                        //列表最后的li透明和高度设置为0 }
                        _self._o.find("li:first").css({ "opacity": 0, "width": 0 });
                        //把列表最后的li提升到顶部，实现有限列表项无限循环滚动显示
                        _self._o.find("li:last").after(_self._o.find("li:first"));
                        //列表顶部的li高度逐渐变高以把下面的li推下去 if(!isIE6){
                        _self._o.find("li:last").animate({ "width": width }, 600);
                        //在非IE6浏览器中设置透明淡入效果
                        _self._o.find("li:last").animate({ "opacity": "1" }, 600);
                    }
                }
                setTimeout(function () { _self.Scrolled(_self._o) }, 5000);
            }
        }
        RLScroll._initialized = true;
    }
}
function PicScroll(o, scrolledNum) {
    this._o = o;
    if (typeof PicScroll.prototype._initialized == "undefined") {
        PicScroll.prototype.Scrolled = function () {
            var _self = this;
            if (_self._o.find("li").length > scrolledNum) {
                _self._o.hover(function () {
                    $(this).attr("ishover", "hovered"); //鼠标经过设置ul的name值为"hovered"
                }, function () {
                    $(this).removeAttr("ishover");
                });

                if (_self._o.attr("ishover") != "hovered") {
                    //判断ul的name属性是否为"hovered"，决定下面代码块是否运行，以实现鼠标经过暂停滚动。
                    //var isIE6 = $.browser.msie && ($.browser.version=="6.0");
                    var isIE6 = false;
                    var width = _self._o.find("li:last").width();
                    if (isIE6) {
                        //判断IE6，jQuery的animate动画和opacity透明在一起使用在IE6中会出现中文重影现象，
                        //所以在ie6中实行透明的禁用。
                        _self._o.find("li:last").css({ "width": 0 });
                    } else {
                        _self._o.find("li:last").css({ "opacity": 0, "width": 0 });
                        //列表最后的li透明和高度设置为0 }
                        _self._o.find("li:first").before(_self._o.find("li:last"));
                        //把列表最后的li提升到顶部，实现有限列表项无限循环滚动显示
                        _self._o.find("li:first").animate({ "width": width }, 300);
                        //列表顶部的li高度逐渐变高以把下面的li推下去 if(!isIE6){
                        _self._o.find("li:first").animate({ "opacity": "1" }, 300);
                        //在非IE6浏览器中设置透明淡入效果
                    }
                }
                setTimeout(function () { _self.Scrolled(_self._o) }, 5000);
            }
        }
        PicScroll._initialized = true;
    }
}

//上海整团补贴交易滚动：针对tr
function WeiboScrollTR(o) {
    this._o = o;
    if (typeof WeiboScrollTR.prototype._initialized == "undefined") {
        WeiboScrollTR.prototype.Scrolled = function () {
            var _self = this;
            if (_self._o.find("tr").length > 1) {
                _self._o.hover(function () {
                    $(this).attr("ishover", "hovered"); //鼠标经过设置ul的name值为"hovered"
                }, function () {
                    $(this).removeAttr("ishover");
                });

                if (_self._o.attr("ishover") != "hovered") {
                    //判断ul的name属性是否为"hovered"，决定下面代码块是否运行，以实现鼠标经过暂停滚动。
                    //var isIE6 = $.browser.msie && ($.browser.version=="6.0");
                    var isIE6 = false;
                    var height = _self._o.find("tr:last").height();
                    if (isIE6) {
                        //判断IE6，jQuery的animate动画和opacity透明在一起使用在IE6中会出现中文重影现象，
                        //所以在ie6中实行透明的禁用。
                        _self._o.find("tr:last").css({ "height": 0 });
                    } else {
                        _self._o.find("tr:last").css({ "opacity": 0, "height": 0 });
                        //列表最后的li透明和高度设置为0 }
                        _self._o.find("tr:first").before(_self._o.find("tr:last"));
                        //把列表最后的li提升到顶部，实现有限列表项无限循环滚动显示
                        _self._o.find("tr:first").animate({ "height": height }, 300);
                        //列表顶部的li高度逐渐变高以把下面的li推下去 if(!isIE6){
                        _self._o.find("tr:first").animate({ "opacity": "1" }, 300);
                        //在非IE6浏览器中设置透明淡入效果
                    }
                }
                setTimeout(function () { _self.Scrolled(_self._o) }, 5000);
            }
        }
        WeiboScroll._initialized = true;
    }
}