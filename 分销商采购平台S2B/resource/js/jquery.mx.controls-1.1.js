/*
@ Control Name: GridView 客户端控件
@ Author: 金亚军
@ Develop Date: 2010.05.04
@ Parameter:
oGrv            gridView 的table对象
sDataSource     数据服务
sKeyId          主键ID
iPageSize       一页显示多少记录
@ Property:
pageIndex       当前页
pageSize        一页显示记录数
pageCount       总分页数(只读)
recordCount     总记录数(只读)
columnField     列字段名集合
*/
function GridView(oGrv, sDataSource, sKeyId, iPageSize, bIsMuitOpts) {
    this.grv = oGrv;
    this.columnField = [];
    this.schCondition = {};
    this.dataSource = sDataSource;
    this.pageSize = iPageSize;
    this.pageCount = 0;
    this.recordCount = 0;
    this.onDataBind = null;
    this.initOpts = null;
    this.readType = 0;//默认取读库数据，1为写库数据
    this.isMuitOpts = bIsMuitOpts;//是否启用操作按钮合并功能
    this.grvCss = {
        loading: "grvLoading",
        gridRowCss: "gridRow",
        gridRowHvCss: "gridRow_Hv",
        gridRowSeCss: "gridRow_Se",
        gridNoDataRow: "gridRow_NoData",
        gridPagIndexCss: "PageIndex"
    };
    this.grvHead = oGrv.find("#grv_head");
    this.grvRows = oGrv.find("#grv_rows");
    this.grvFoot = oGrv.find("#grv_foot");
    this.grvSeAll = oGrv.find("#grv_SeAll");
    this.grvPaging = {
        paging: oGrv.find("#paging"),
        pageSize: "",
        pageIndex: oGrv.find("#paging #paging_pageIndex"),
        pageCount: oGrv.find("#paging #paging_pageCount"),
        recordCount: oGrv.find("#paging #paging_recordCount"),
        pageList: oGrv.find("#paging #paging_pageList"),
        pageNum: oGrv.find("#paging #paging_pageNum"),
        pageGoto: oGrv.find(".paging_goto"),
        pageNumSplit: 5
    };
    this.grvCache = [];
    if (typeof GridView.prototype._initialized == "undefined") {
        //清空缓存
        GridView.prototype.ClearCache = function () {
            this.grvCache = [];
        }
        //序列化GridView的字段
        GridView.prototype.SerzColumnField = function (aColumnField) {
            var serzFed = "[";
            for (var i = 0; i < aColumnField.length; i++) {
                serzFed += "\"" + aColumnField[i] + "\", ";
            }
            if (serzFed.length > 1) serzFed = serzFed.slice(0, serzFed.lastIndexOf(", "));
            serzFed += "]";
            return serzFed;
        };
        GridView.prototype.ShowLoading = function () {
            this.grvRows.html("<tr class=\"" + this.grvCss.gridRowCss + "\"><td colspan=" + this.grvHead.find("th").length + " class=\"" + this.grvCss.gridNoDataRow + " " + this.grvCss.loading + "\"></td></tr>");
        };
        GridView.prototype.HideLoading = function () {
            this.grvRows.html("");
        };
        GridView.prototype.NoData = function () {
            this.grvRows.html("<tr class=\"" + this.grvCss.gridRowCss + "\"><td colspan=" + this.grvHead.find("th").length + " class=\"" + this.grvCss.gridNoDataRow + "\">&lt;暂无数据&gt;</td></tr>");
        };
        GridView.prototype.AbnormalData = function () {
            this.grvRows.html("<tr class=\"" + this.grvCss.gridRowCss + "\"><td colspan=" + this.grvHead.find("th:not([colspan][display])").length + " class=\"" + this.grvCss.gridNoDataRow + "\">&lt;数据异常&gt;</td></tr>");
        };
        GridView.prototype.SerzRowField = function (oRow) {
            var obj = {};
            for (var i = 0; i < this.columnField.length; i++) {
                obj[this.columnField[i]] = oRow.attr(this.columnField[i]);
            }
            return obj;
        };
        GridView.prototype.PagingInit = function (iPageIndex, iPageSize, iPageCount, iRecordCount) {
            var _self = this;
            this.grvPaging.pageIndex.html(iPageIndex);
            this.grvPaging.pageCount.html(iPageCount);
            this.grvPaging.recordCount.html(iRecordCount);
            //pageList initialized
            this.grvPaging.pageList.val(iPageIndex);
            this.grvPaging.pageList.unbind();
            this.grvPaging.pageList.bind("keydown", function (e) {
                if (!parseInt(this.value)) { return; }
                if (this.value > iPageCount || this.value < 0) return;
                if (e.keyCode == 13) {
                    _self.Load(parseInt(this.value));
                }
            });
            this.grvPaging.pageGoto.unbind();
            this.grvPaging.pageGoto.bind("click", function () {
                if (!parseInt(_self.grvPaging.pageList.val(), 10)) { return; }
                var pageindex = _self.grvPaging.pageList.val();
                if (pageindex > iPageCount || pageindex < 0 || pageindex == iPageIndex) { return; }
                _self.Load(parseInt(pageindex));
            });

            //page number initialized
            var pageNumCtrl = "<a id=\"paging_First\" href=\"javascript:;\" class=\"First\" hidefocus=\"true\">首页</a>";
            pageNumCtrl += "<a id=\"paging_Previous\" href=\"javascript:;\" class=\"Previous\" hidefocus=\"true\">上一页</a>";
            var pageBegin = iPageIndex - parseInt(this.grvPaging.pageNumSplit / 2);
            if (pageBegin >= parseInt(this.grvPaging.pageNumSplit / 2, 10) && this.pageCount > this.grvPaging.pageNumSplit) {
                pageNumCtrl += "<em class=\"pageMore\">..</em>";
            }
            if (iPageIndex <= parseInt(this.grvPaging.pageNumSplit / 2, 10) + 1) {
                pageBegin = 1;
            }
            var pageEnd = pageBegin + (this.grvPaging.pageNumSplit - 1);
            if (pageEnd >= iPageCount) {
                pageBegin = iPageCount - this.grvPaging.pageNumSplit + 1;
                if (pageBegin <= 0) pageBegin = 1;
                pageEnd = iPageCount;
            }

            for (var j = pageBegin; j <= pageEnd; j++) {
                if (iPageIndex == j) {
                    pageNumCtrl += "<a id=\"paging_Go_" + j + "\" href=\"javascript:;\" hidefocus=\"true\" class=\"" + this.grvCss.gridPagIndexCss + "\">" + j + "</a>";
                }
                else {
                    pageNumCtrl += "<a id=\"paging_Go_" + j + "\" href=\"javascript:;\" hidefocus=\"true\">" + j + "</a>";
                }
            }
            if (pageEnd < iPageCount) {
                pageNumCtrl += "<em class=\"pageMore\">..</em>";
            }
            pageNumCtrl += "<a id=\"paging_Next\" href=\"javascript:;\" class=\"PageNext\" hidefocus=\"true\">下一页</a>";
            pageNumCtrl += "<a id=\"paging_Last\" href=\"javascript:;\" class=\"PageLast\" hidefocus=\"true\">页尾</a>";

            this.grvPaging.pageNum.html(pageNumCtrl);

            //page number events initalized
            if (iPageCount > 1) {
                this.grvPaging.pageNum.find("#paging_First").click(function () { _self.Load(1); _self.grvPaging.pageList.val(1); });
                this.grvPaging.pageNum.find("#paging_Previous").click(function () { if (iPageIndex - 1 <= 0) { _self.Load(1); _self.grvPaging.pageList.val(1); } else { _self.Load(iPageIndex - 1); _self.grvPaging.pageList.val(iPageIndex - 1); } });
                this.grvPaging.pageNum.find("#paging_Next").click(function () {
                    if (iPageIndex + 1 >= iPageCount) {
                        _self.Load(iPageCount);
                        _self.grvPaging.pageList.val(iPageCount);
                    } else {
                        _self.Load(iPageIndex + 1);
                        _self.grvPaging.pageList.val(iPageIndex + 1);
                    }
                });
                this.grvPaging.pageNum.find("#paging_Last").click(function () { _self.Load(iPageCount); _self.grvPaging.pageList.val(iPageCount); });
                this.grvPaging.pageNum.find("a[id^='paging_Go_']").click(function () { var num = $(this).html(); _self.Load(parseInt(num, 10)); _self.grvPaging.pageList.val(parseInt(num, 10)); });
            }
            //设置分页数控件
            this.grvPaging.pageSize.val(iPageSize);
        };
        GridView.prototype.SelectorInit = function () {
            var _self = this;
            if (_self.grvSeAll.length == 0)
                return;
            _self.grvSeAll[0].checked = false;
            if (_self.grvRows.find("input[id^='chk_row']").length <= 0) return;
            _self.grvSeAll.click(function () {
                var o = this;
                _self.grvRows.find("input[id^='chk_row_']").each(function () {
                    if (!this.disabled) { this.checked = o.checked; }
                });
                _self.grvRows.find("tr[id^='grv_row_']").toggleClass(_self.grvCss.gridRowSeCss, o.checked);
            });
            _self.grvRows.find("input[id^='chk_row_']").click(function () {
                $(this).parents("tr[id^='grv_row_']").toggleClass(_self.grvCss.gridRowSeCss, this.checked);
                var isSeAll = true;
                var grvRows = _self.grvRows.find("input[id^='chk_row_']");
                for (var i = 0; i < grvRows.length; i++) {
                    if (!grvRows[i].disabled) {
                        if (grvRows[i].checked == false) {
                            isSeAll = false;
                            break;
                        }
                    }
                }
                _self.grvSeAll[0].checked = isSeAll;
            });
        };
        GridView.prototype.SelectRow = function () {
            var rows = { keyIds: [], sezKeyIds: "", rowItems: [], count: 0 };
            var rowItem = [];
            var keyIds = [];
            var _self = this;
            this.grvRows.find("input[id^='chk_row_']").each(function () {
                if (this.checked) {
                    rowItem.push(_self.SerzRowField($(this).parents("tr[id^='grv_row_']")));
                    keyIds.push($(this).val());
                }
            });
            rows.keyIds = keyIds;
            rows.sezKeyIds = _self.SerzColumnField(keyIds);
            rows.rowItems = rowItem;
            rows.count = rowItem.length;
            return rows;
        };

        GridView.prototype.MuiltOptInit = function () {
            var _self = this;
            _self.grv.find("#grv_rows .gridOpt a").click(function (e) {
                e.stopPropagation();
                var guid = $(this).parents("tr.gridRow").attr("guid");
                var optLnks = $(this).parents(".gridOpt").find("span");
                $(".gridOptLay").remove();
                //生成操作按钮
                var html = [];
                html.push('<div class="gridOptLay">');
                html.push(optLnks.html());
                html.push('</div>');
                $(document.body).append(html.join(''));
                var optLay = $(".gridOptLay");
                var pos = { top: $(this).position().top - (optLay.outerHeight() / 2) + ($(this).outerHeight() / 2), left: $(this).position().left - (optLay.outerWidth() / 2) + ($(this).outerWidth() / 2) };
                if (pos.top + optLay.outerHeight() > $(window.document).height()) {
                    pos.top = pos.top - (pos.top + optLay.outerHeight() - $(window.document).height());
                }
                optLay.css({ top: pos.top + "px", left: pos.left + "px" });
                $(document.body).click(function (e) {
                    optLay.remove();
                });
                //执行自定义操作
                if (typeof (_self.initOpts) == "function") { _self.initOpts(optLay, guid, $(this).parents("tr.gridRow")); }
                //optLay.click(function (e) { e.stopPropagation(); });
            });
        };
        //加载GridView
        GridView.prototype.Load = function (iPageIndex, loadType) {
            var _self = this;
            //检查是否已经缓存
            for (var i = 0; i < _self.grvCache.length; i++) {
                if (iPageIndex == _self.grvCache[i].pageIndex) {
                    _self.grvRows.html(_self.grvCache[i].rows.join("").toString());
                    _self.grvRows.find("tr[id^='grv_row_']").mouseover(function () { $(this).toggleClass(_self.grvCss.gridRowHvCss, true); });
                    _self.grvRows.find("tr[id^='grv_row_']").mouseout(function () {
                        $(this).toggleClass(_self.grvCss.gridRowHvCss, false);
                        if ($(this).find("input[id^='chk_row_']").length <= 0) { return; }
                        if (!$(this).find("input[id^='chk_row_']")[0].checked) {
                            $(this).toggleClass(_self.grvCss.gridRowSeCss, false);
                        }
                    });
                    _self.grvRows.find("tr[id^='grv_row_']").click(function () {
                        if ($(this).find("input[id^='chk_row_']").length <= 0) { return; }
                        var chkBox = $(this).find("input[id^='chk_row_']")[0];
                        if (!chkBox.disabled) {
                            chkBox.checked = !chkBox.checked;
                            $(this).toggleClass(_self.grvCss.gridRowSeCss, chkBox.checked);
                            var isSeAll = true;
                            var grvRows = _self.grvRows.find("input[id^='chk_row_']");
                            for (var i = 0; i < grvRows.length; i++) {
                                if (grvRows[i].checked == false) {
                                    isSeAll = false;
                                    break;
                                }
                            }
                            _self.grvSeAll[0].checked = isSeAll;
                        }
                    });
                    _self.grvRows.find("input[id^='chk_row_']").click(function () {
                        if (!this.disabled) { this.checked = !this.checked; }
                    });
                    //执行数据加载绑定事件
                    if (typeof (_self.onDataBind) == "function") { _self.onDataBind(); }

                    //执行操作按钮合并
                    if (_self.isMuitOpts) { _self.MuiltOptInit(); }

                    _self.PagingInit(_self.grvCache[i].pageIndex, _self.grvCache[i].pageSize, _self.grvCache[i].pageCount, _self.grvCache[i].recordCount);
                    //初始化框架
                    if ((typeof frameWork) != "undefined") frameWork.Init();
                    return;
                }
            }
            var iConnType = Code.ConnType.LoadRead;
            if (typeof (loadType) != "undefined") {
                if (loadType != Code.ConnType.LoadRead && loadType != Code.ConnType.LoadWrite && loadType != Code.ConnType.LoadReport)
                { iConnType = Code.ConnType.LoadRead; }
            }
            else { iConnType = Code.ConnType.LoadRead; }
            var search = {
                ConnType: iConnType,
                PageIndex: iPageIndex,
                PageSize: _self.pageSize,
                Columns: _self.columnField,
                Condition: _self.schCondition
            };
            var dataReq = $.toJSON({ search: search });
            //var dataReq = "{jsonData:'" + JSON.stringify(search) + "'}";
            //var dataReq = "{columns: " + _self.SerzColumnField(_self.columnField) + ", pageSize: " + _self.pageSize + ", pageIndex: " + iPageIndex + ", condition: " + _self.SerzColumnField(_self.schCondition) + " }";
            //debugger;
            AjaxPost(dataReq, _self.dataSource, function (data) {
                var jsonData = $.secureEvalJSON(data.d);
                if (jsonData == null) {
                    _self.AbnormalData();
                    //_self.grvTotal.html("<tr></tr>");
                    _self.PagingInit(1, 1, 1, 0);
                    return;
                }
                _self.grvRows.html("");
                if (jsonData.rows.length > 0) {
                    _self.grvRows.html(jsonData.rows.join("").toString());
                    _self.grvRows.find("tr[id^='grv_row_']").mouseover(function () { $(this).toggleClass(_self.grvCss.gridRowHvCss, true); });
                    _self.grvRows.find("tr[id^='grv_row_']").mouseout(function () {
                        $(this).toggleClass(_self.grvCss.gridRowHvCss, false);
                        if ($(this).find("input[id^='chk_row_']").length <= 0) { return; }
                        if (!$(this).find("input[id^='chk_row_']")[0].checked) {
                            $(this).toggleClass(_self.grvCss.gridRowSeCss, false);
                        }
                    });
                    _self.grvRows.find("tr[id^='grv_row_']").click(function () {
                        if ($(this).find("input[id^='chk_row_']").length <= 0) { return; }
                        var chkBox = $(this).find("input[id^='chk_row_']")[0];
                        if (!chkBox.disabled) {
                            chkBox.checked = !chkBox.checked;
                            $(this).toggleClass(_self.grvCss.gridRowSeCss, chkBox.checked);
                            var isSeAll = true;
                            var grvRows = _self.grvRows.find("input[id^='chk_row_']");
                            for (var i = 0; i < grvRows.length; i++) {
                                if (grvRows[i].checked == false) {
                                    isSeAll = false;
                                    break;
                                }
                            }
                            _self.grvSeAll[0].checked = isSeAll;
                        }
                    });
                    _self.grvRows.find("input[id^='chk_row_']").click(function () {
                        if (!this.disabled) { this.checked = !this.checked; }
                    });
                    _self.grvCache.push(jsonData);
                    _self.recordCount = jsonData.recordCount;
                    _self.pageIndex = jsonData.pageIndex;
                    _self.pageCount = jsonData.pageCount;
                    _self.pageSize = jsonData.pageSize;

                    //执行数据加载绑定事件
                    if (typeof (_self.onDataBind) == "function") { _self.onDataBind(); }

                    //执行操作按钮合并
                    if (_self.isMuitOpts) { _self.MuiltOptInit(); }
                }
                else {
                    _self.NoData();
                }
                //select checkbox initialized
                _self.SelectorInit();

                //paging initialized
                _self.PagingInit(jsonData.pageIndex, jsonData.pageSize, jsonData.pageCount, jsonData.recordCount);
                //初始化框架
                if ((typeof frameWork) != "undefined") frameWork.Init();
            });
            _self.ShowLoading();
        };
        GridView._initialized = true;
    }
}

/*
@ Control Name: GridView 客户端控件
@ Author: 王志浩
@ Develop Date: 2014年5月16日
@ Parameter:
oGrv            gridView 的table对象 无翻页
sDataSource     数据服务
sKeyId          主键ID
iPageSize       一页显示多少记录
@ Property:
recordCount     总记录数(只读)
columnField     列字段名集合
*/
function GridViewNoPaging(oGrv, sDataSource, sKeyId, bIsMuitOpts) {
    this.grv = oGrv;
    this.columnField = [];
    this.schCondition = {};
    this.dataSource = sDataSource;
    this.onDataBind = null;
    this.isMuitOpts = bIsMuitOpts;//是否启用操作按钮合并功能
    this.grvCss = {
        loading: "grvLoading",
        gridRowCss: "gridRow",
        gridRowHvCss: "gridRow_Hv",
        gridRowSeCss: "gridRow_Se",
        gridNoDataRow: "gridRow_NoData"
    };
    this.grvHead = oGrv.find("#grv_head");
    this.grvRows = oGrv.find("#grv_rows");
    this.grvSeAll = oGrv.find("#grv_SeAll");
    this.grvCache = [];
    if (typeof GridViewNoPaging.prototype._initialized == "undefined") {
        GridViewNoPaging.prototype.ClearCache = function () {
            this.grvCache = [];
        }
        //序列化GridView的字段
        GridViewNoPaging.prototype.SerzColumnField = function (aColumnField) {
            var serzFed = "[";
            for (var i = 0; i < aColumnField.length; i++) {
                serzFed += "\"" + aColumnField[i] + "\", ";
            }
            if (serzFed.length > 1) serzFed = serzFed.slice(0, serzFed.lastIndexOf(", "));
            serzFed += "]";
            return serzFed;
        };
        GridViewNoPaging.prototype.ShowLoading = function () {
            this.grvRows.html("<tr class=\"" + this.grvCss.gridRowCss + "\"><td colspan=" + this.grvHead.find("th").length + " class=\"" + this.grvCss.gridNoDataRow + " " + this.grvCss.loading + "\"></td></tr>");
        };
        GridViewNoPaging.prototype.HideLoading = function () {
            this.grvRows.html("");
        };
        GridViewNoPaging.prototype.NoData = function () {
            this.grvRows.html("<tr class=\"" + this.grvCss.gridRowCss + "\"><td colspan=" + this.grvHead.find("th").length + " class=\"" + this.grvCss.gridNoDataRow + "\">&lt;暂无数据&gt;</td></tr>");
        };
        GridViewNoPaging.prototype.AbnormalData = function () {
            this.grvRows.html("<tr class=\"" + this.grvCss.gridRowCss + "\"><td colspan=" + this.grvHead.find("th:not([colspan][display])").length + " class=\"" + this.grvCss.gridNoDataRow + "\">&lt;数据异常&gt;</td></tr>");
        };
        GridViewNoPaging.prototype.SerzRowField = function (oRow) {
            var obj = {};
            for (var i = 0; i < this.columnField.length; i++) {
                obj[this.columnField[i]] = oRow.attr(this.columnField[i]);
            }
            return obj;
        };
        GridViewNoPaging.prototype.SelectorInit = function () {
            var _self = this;
            _self.grvSeAll[0].checked = false;
            if (_self.grvRows.find("input[id^='chk_row']").length <= 0) return;
            _self.grvSeAll.click(function () {
                var o = this;
                _self.grvRows.find("input[id^='chk_row_']").each(function () {
                    this.checked = o.checked;
                });
                _self.grvRows.find("tr[id^='grv_row_']").toggleClass(_self.grvCss.gridRowSeCss, o.checked);
            });
            _self.grvRows.find("input[id^='chk_row_']").click(function () {
                $(this).parents("tr[id^='grv_row_']").toggleClass(_self.grvCss.gridRowSeCss, this.checked);
                var isSeAll = true;
                var grvRows = _self.grvRows.find("input[id^='chk_row_']");
                for (var i = 0; i < grvRows.length; i++) {
                    if (grvRows[i].checked == false) {
                        isSeAll = false;
                        break;
                    }
                }
                _self.grvSeAll[0].checked = isSeAll;
            });
        };
        GridViewNoPaging.prototype.SelectRow = function () {
            var rows = { keyIds: [], sezKeyIds: "", rowItems: [], count: 0 };
            var rowItem = [];
            var keyIds = [];
            var _self = this;
            this.grvRows.find("input[id^='chk_row_']").each(function () {
                if (this.checked) {
                    rowItem.push(_self.SerzRowField($(this).parents("tr[id^='grv_row_']")));
                    keyIds.push($(this).val());
                }
            });
            rows.keyIds = keyIds;
            rows.sezKeyIds = _self.SerzColumnField(keyIds);
            rows.rowItems = rowItem;
            rows.count = rowItem.length;
            return rows;
        };
        GridViewNoPaging.prototype.MuiltOptInit = function () {
            var _self = this;
            _self.grv.find("#grv_rows .gridOpt a").click(function (e) {
                e.stopPropagation();
                var guid = $(this).parents("tr.gridRow").attr("guid");
                var optLnks = $(this).parents(".gridOpt").find("span");
                //生成操作按钮
                var html = [];
                html.push('<div class="gridOptLay">');
                html.push(optLnks.html());
                html.push('</div>');
                $(document.body).append(html.join(''));
                var optLay = $(".gridOptLay");
                var pos = { top: $(this).position().top - (optLay.outerHeight() / 2) + ($(this).outerHeight() / 2), left: $(this).position().left - (optLay.outerWidth() / 2) + ($(this).outerWidth() / 2) };
                if (pos.top + optLay.outerHeight() > $(window.document).height()) {
                    pos.top = pos.top - (pos.top + optLay.outerHeight() - $(window.document).height());
                }
                optLay.css({ top: pos.top + "px", left: pos.left + "px" });
                $(document.body).click(function (e) {
                    optLay.remove();
                });
                //执行自定义操作
                if (typeof (_self.initOpts) == "function") { _self.initOpts(optLay, guid, $(this).parents("tr.gridRow")); }
                //optLay.click(function (e) { e.stopPropagation(); });
            });
        };
        //加载GridViewNoPaging
        GridViewNoPaging.prototype.Load = function (loadType) {
            var _self = this;
            var iConnType = Code.ConnType.LoadRead;
            if (typeof (loadType) != "undefined") {
                if (loadType != Code.ConnType.LoadRead && loadType != Code.ConnType.LoadWrite && loadType != Code.ConnType.LoadReport)
                { iConnType = Code.ConnType.LoadRead; }
                else { iConnType = loadType; }
            }
            else { iConnType = Code.ConnType.LoadRead; }
            var search = {
                ConnType: iConnType,
                Columns: _self.columnField,
                Condition: _self.schCondition
            };
            var dataReq = $.toJSON({ search: search });
            //var dataReq = "{jsonData:'" + JSON.stringify(search) + "'}";
            //var dataReq = "{columns: " + _self.SerzColumnField(_self.columnField) + ", pageSize: " + _self.pageSize + ", pageIndex: " + iPageIndex + ", condition: " + _self.SerzColumnField(_self.schCondition) + " }";
            AjaxPost(dataReq, _self.dataSource, function (data) {
                var jsonData = $.secureEvalJSON(data.d);
                if (jsonData == null) {
                    _self.AbnormalData();
                    //_self.grvTotal.html("<tr></tr>");
                    //_self.PagingInit(1, 1, 1, 0);
                    return;
                }
                _self.grvRows.html("");
                if (jsonData.rows.length > 0) {
                    _self.grvRows.html(jsonData.rows.join("").toString());
                    _self.grvRows.find("tr[id^='grv_row_']").mouseover(function () { $(this).toggleClass(_self.grvCss.gridRowHvCss, true); });
                    _self.grvRows.find("tr[id^='grv_row_']").mouseout(function () {
                        $(this).toggleClass(_self.grvCss.gridRowHvCss, false);
                        if (!$(this).find("input[id^='chk_row_']")[0].checked) {
                            $(this).toggleClass(_self.grvCss.gridRowSeCss, false);
                        }
                    });
                    _self.grvRows.find("tr[id^='grv_row_']").click(function () {
                        var chkBox = $(this).find("input[id^='chk_row_']")[0];
                        chkBox.checked = !chkBox.checked;
                        $(this).toggleClass(_self.grvCss.gridRowSeCss, chkBox.checked);
                        var isSeAll = true;
                        var grvRows = _self.grvRows.find("input[id^='chk_row_']");
                        for (var i = 0; i < grvRows.length; i++) {
                            if (grvRows[i].checked == false) {
                                isSeAll = false;
                                break;
                            }
                        }
                        _self.grvSeAll[0].checked = isSeAll;
                    });
                    _self.grvRows.find("input[id^='chk_row_']").click(function () {
                        this.checked = !this.checked;
                    });
                    _self.grvCache.push(jsonData);
                    //执行操作按钮合并
                    if (_self.isMuitOpts) { _self.MuiltOptInit(); }
                    //执行数据加载绑定事件
                    if (typeof (_self.onDataBind) == "function") { _self.onDataBind(); }
                }
                else {
                    _self.NoData();
                }
                //select checkbox initialized
                _self.SelectorInit();

                //初始化框架
                if ((typeof frameWork) != "undefined") frameWork.Init();
            });
            _self.ShowLoading();
        };
        GridViewNoPaging._initialized = true;
    }
}


//通用列表分页类
function ListView(oLv, oPaging, sDataSource, sKeyId, iPageSize, sInfoUrl, oPagingClone) {
    this.lv = oLv;
    this.columnField = [];
    this.schCondition = {};
    this.statusHtml = "";
    this.infoUrl = sInfoUrl;
    this.dataSource = sDataSource;
    //当前页面名称
    //debugger;
    var url = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.indexOf('.'));
    if ($.cookie("ListView_PageSize") == null) {
        this.pageSize = iPageSize;
        $.cookie("ListView_PageSize", url + ":" + this.pageSize + ";", { expires: 365 });
    }
    //读取当前页面的pageSize
    var pageSizeCokie = $.cookie("ListView_PageSize");
    if (pageSizeCokie.indexOf(url) >= 0) {
        var subPageSize = pageSizeCokie.substring(pageSizeCokie.indexOf(url));
        var oldValue = subPageSize.substring(0, subPageSize.indexOf(';'));
        this.pageSize = parseInt(oldValue.substring(oldValue.indexOf(":") + 1), 10);
    } else {
        this.pageSize = iPageSize;
    }
    //this.pageSize = iPageSize;
    this.pageCount = 0;
    this.recordCount = 0;
    this.pageIndex = 0;
    this.pagingClone = oPagingClone;
    this.lvCss = {
        loading: "lvLoading",
        noDataCss: "lvNoData",
        lvPagIndexCss: "pageIndex",
        lvPagingCss: "PageIndex"
    };
    this.lvRows = oLv;
    this.lvPaging = {
        paging: oPaging,
        pageSize: oPaging.find("#paging_pageSize"),
        pageIndex: oPaging.find("#paging_pageIndex"),
        pageCount: oPaging.find("#paging_pageCount"),
        recordCount: oPaging.find("#paging_recordCount"),
        pageList: oPaging.find("#paging_pageList"),
        pageNum: oPaging.find("#paging_pageNum"),
        pageGoto: oPaging.find(".paging_goto"),
        pageNumSplit: 5
    };
    this.lvCache = [];
    this.Complate = function () { };
    if (typeof ListView.prototype._initialized == "undefined") {
        //清空缓存
        ListView.prototype.ClearCache = function () {
            this.lvCache = [];
        }
        //序列化ListView的字段
        ListView.prototype.SerzColumnField = function (aColumnField) {
            var serzFed = "[";
            for (var i = 0; i < aColumnField.length; i++) {
                serzFed += "\"" + aColumnField[i] + "\", ";
            }
            if (serzFed.length > 1) serzFed = serzFed.slice(0, serzFed.lastIndexOf(", "));
            serzFed += "]";
            return serzFed;
        };
        ListView.prototype.ShowLoading = function () {
            if (this.statusHtml.length <= 0) {
                this.lvRows.html("<span class=\"" + this.lvCss.loading + "\"></span>");
            }
            else {
                this.lvRows.html(this.statusHtml.replace("{0}", "<span class=\"" + this.lvCss.loading + "\"></span>"));
            }
        };
        ListView.prototype.HideLoading = function () {
            this.lvRows.html("");
        };
        ListView.prototype.NoData = function () {
            if (this.statusHtml.length <= 0) {
                this.lvRows.html("<span class=\"" + this.lvCss.noDataCss + "\">&lt;暂无信息&gt;</span>");
            }
            else {
                this.lvRows.html(this.statusHtml.replace("{0}", "<span class=\"" + this.lvCss.noDataCss + "\">&lt;暂无信息&gt;</span>"));
            }
        };
        ListView.prototype.AbnormalData = function () {
            if (this.statusHtml.length <= 0) {
                this.lvRows.html("<span class=\"" + this.lvCss.noDataCss + "\">&lt;数据异常&gt;</span>");
            }
            else {
                this.lvRows.html(this.statusHtml.replace("{0}", "<span class=\"" + this.lvCss.noDataCss + "\">&lt;数据异常&gt;</span>"));
            }
        };
        ListView.prototype.SerzRowField = function (oRow) {
            var obj = {};
            for (var i = 0; i < this.columnField.length; i++) {
                obj[this.columnField[i]] = oRow.attr(this.columnField[i]);
            }
            return obj;
        };
        ListView.prototype.PagingInit = function (iPageIndex, iPageSize, iPageCount, iRecordCount) {
            var _self = this;
            this.lvPaging.pageIndex.html(iPageIndex);
            this.lvPaging.pageCount.html(iPageCount);
            this.lvPaging.recordCount.html(iRecordCount);
            //pageList initialized
            this.lvPaging.pageList.val(iPageIndex);
            this.lvPaging.pageList.unbind();
            this.lvPaging.pageList.bind("keydown", function (e) {
                if (!parseInt(this.value)) { return; }
                if (this.value > iPageCount || this.value < 0) return;
                if (e.keyCode == 13) {
                    _self.Load(parseInt(this.value));
                }
            });
            this.lvPaging.pageGoto.unbind();
            this.lvPaging.pageGoto.bind("click", function () {
                if (!parseInt(_self.lvPaging.pageList.val(), 10)) { return; }
                var pageindex = _self.lvPaging.pageList.val();
                if (pageindex > iPageCount || pageindex < 0 || pageindex == iPageIndex) { return; }
                _self.Load(parseInt(pageindex));
            });

            //page number initialized
            var pageNumCtrl = "<a id=\"paging_First\" href=\"javascript:;\" class=\"First\" hidefocus=\"true\">首页</a>";
            pageNumCtrl += "<a id=\"paging_Previous\" href=\"javascript:;\" class=\"Previous\" hidefocus=\"true\">上一页</a>";
            var pageBegin = iPageIndex - parseInt(this.lvPaging.pageNumSplit / 2);
            if (pageBegin >= parseInt(this.lvPaging.pageNumSplit / 2, 10)) {
                pageNumCtrl += "<em class=\"pageMore\">..</em>";
            }
            if (iPageIndex <= parseInt(this.lvPaging.pageNumSplit / 2, 10) + 1) {
                pageBegin = 1;
            }
            var pageEnd = pageBegin + (this.lvPaging.pageNumSplit - 1);
            if (pageEnd >= iPageCount) {
                pageBegin = iPageCount - this.lvPaging.pageNumSplit + 1;
                if (pageBegin <= 0) pageBegin = 1;
                pageEnd = iPageCount;
            }

            for (var j = pageBegin; j <= pageEnd; j++) {
                if (iPageIndex == j) {
                    pageNumCtrl += "<a id=\"paging_Go_" + j + "\" href=\"javascript:;\" hidefocus=\"true\" class=\"" + this.lvCss.lvPagingCss + "\">" + j + "</a>";
                }
                else {
                    pageNumCtrl += "<a id=\"paging_Go_" + j + "\" href=\"javascript:;\" hidefocus=\"true\">" + j + "</a>";
                }
            }
            if (pageEnd < iPageCount) {
                pageNumCtrl += "<em class=\"pageMore\">..</em>";
            }
            pageNumCtrl += "<a id=\"paging_Next\" href=\"javascript:;\" class=\"PageNext\" hidefocus=\"true\">下一页</a>";
            pageNumCtrl += "<a id=\"paging_Last\" href=\"javascript:;\" class=\"PageLast\" hidefocus=\"true\">页尾</a>";

            this.lvPaging.pageNum.html(pageNumCtrl);

            //page number events initalized
            if (iPageCount > 1) {
                this.lvPaging.pageNum.find("#paging_First").click(function () { _self.Load(1); _self.lvPaging.pageList.val(1); });
                this.lvPaging.pageNum.find("#paging_Previous").click(function () { if (iPageIndex - 1 <= 0) { _self.Load(1); _self.lvPaging.pageList.val(1); } else { _self.Load(iPageIndex - 1); _self.lvPaging.pageList.val(iPageIndex - 1); } });
                this.lvPaging.pageNum.find("#paging_Next").click(function () {
                    if (iPageIndex + 1 >= iPageCount) {
                        _self.Load(iPageCount);
                        _self.lvPaging.pageList.val(iPageCount);
                    } else {
                        _self.Load(iPageIndex + 1);
                        _self.lvPaging.pageList.val(iPageIndex + 1);
                    }
                });
                this.lvPaging.pageNum.find("#paging_Last").click(function () { _self.Load(iPageCount); _self.lvPaging.pageList.val(iPageCount); });
                this.lvPaging.pageNum.find("a[id^='paging_Go_']").click(function () {
                    var num = $(this).html(); _self.Load(parseInt(num, 10)); _self.lvPaging.pageList.val(parseInt(num, 10));
                });
            }

            //check paging clone objects.
            if (_self.pagingClone) {
                //_self.pagingClone.find("#paging_pageIndexClone").html(iPageIndex);
                _self.pagingClone.html(this.lvPaging.paging.html());
                _self.pagingClone.find("#paging_First").click(function () { _self.Load(1); });
                _self.pagingClone.find("#paging_Previous").click(function () { if (iPageIndex - 1 <= 0) { _self.Load(1); } else { _self.Load(iPageIndex - 1); } });
                _self.pagingClone.find("#paging_Next").click(function () { if (iPageIndex + 1 >= iPageCount) { _self.Load(iPageCount); } else { _self.Load(iPageIndex + 1); } });
                _self.pagingClone.find("#paging_Last").click(function () { _self.Load(iPageCount); });
                _self.pagingClone.find("a[id^='paging_Go_']").click(function () { _self.Load(parseInt($(this).text(), 10)); });
                _self.pagingClone.find("#paging_pageList").unbind("change");
                _self.pagingClone.find("#paging_pageList").one("change", function () { _self.Load($(this).find("option:selected").val()); });
            }
            //设置分页数控件
            this.lvPaging.pageSize.val(iPageSize);
        };
        //加载ListView
        ListView.prototype.FristLoad = function (data) {
            var _self = this;
            var jsonData = $.secureEvalJSON(data);
            _self.lvRows.html("");
            if (jsonData.rows.length > 0) {
                _self.lvRows.html(jsonData.rows.join("").toString());
                _self.lvCache.push(jsonData);
                _self.recordCount = jsonData.recordCount;
                _self.pageIndex = jsonData.pageIndex;
                _self.pageCount = jsonData.pageCount;
                _self.pageSize = jsonData.pageSize;
            }
            else {
                _self.NoData();
            }

            //paging initialized
            _self.PagingInit(jsonData.pageIndex, jsonData.pageSize, jsonData.pageCount, jsonData.recordCount);
            _self.Complate();
        };
        //加载ListView
        ListView.prototype.Load = function (iPageIndex, loadType) {
            var _self = this;
            //检查是否已经缓存
            for (var i = 0; i < _self.lvCache.length; i++) {
                if (iPageIndex == _self.lvCache[i].pageIndex) {
                    _self.lvRows.html(_self.lvCache[i].rows.join("").toString());
                    _self.PagingInit(_self.lvCache[i].pageIndex, _self.lvCache[i].pageSize, _self.lvCache[i].pageCount, _self.lvCache[i].recordCount);
                    _self.Complate();
                    return;
                }
            }
            //debugger;
            var iConnType = Code.ConnType.LoadRead;
            if (typeof (loadType) != "undefined") {
                if (loadType != Code.ConnType.LoadRead && loadType != Code.ConnType.LoadWrite && loadType != Code.ConnType.LoadReport)
                { iConnType = Code.ConnType.LoadRead; }
                else { iConnType = loadType; }
            }
            else { iConnType = Code.ConnType.LoadRead; }
            var search = {
                ConnType: iConnType,
                PageIndex: iPageIndex,
                PageSize: _self.pageSize,
                Columns: _self.columnField,
                Condition: _self.schCondition
            };
            var dataReq = $.toJSON({ search: search });
            //var dataReq = "{columns: " + _self.SerzColumnField(_self.columnField) +
            //                ", pageSize: " + _self.pageSize +
            //                ", pageIndex: " + iPageIndex +
            //                ", condition: " + _self.SerzColumnField(_self.schCondition) +
            //                ", infoUrl:'" + _self.infoUrl + "' }";
            AjaxPost(dataReq, _self.dataSource, function (data) {
                var jsonData = $.secureEvalJSON(data.d);
                if (jsonData == null) {
                    _self.AbnormalData();
                    //_self.grvTotal.html("<tr></tr>");
                    _self.PagingInit(1, 1, 1, 0);
                    return;
                }
                _self.lvRows.html("");
                if (jsonData.rows.length > 0) {
                    _self.lvRows.html(jsonData.rows.join("").toString());
                    _self.lvCache.push(jsonData);
                    _self.recordCount = jsonData.recordCount;
                    _self.pageIndex = jsonData.pageIndex;
                    _self.pageCount = jsonData.pageCount;
                    _self.pageSize = jsonData.pageSize;
                }
                else {
                    _self.NoData();
                }

                //paging initialized
                _self.PagingInit(jsonData.pageIndex, jsonData.pageSize, jsonData.pageCount, jsonData.recordCount);
            }, _self.Complate);
            _self.ShowLoading();
        };
        //初始化每页显示记录条数
        ListView.prototype.Init = function () {
            var grv = this;
            this.lvPaging.pageSize.change(function () {
                //当前页面名称
                var url = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.indexOf('.'));
                //pageSizeCokie值
                var pageSizeCokie = $.cookie("ListView_PageSize");
                if (pageSizeCokie.indexOf(url) >= 0) {
                    var subPageSize = pageSizeCokie.substring(pageSizeCokie.indexOf(url));
                    var oldValue = subPageSize.substring(0, subPageSize.indexOf(';'));
                    //更换当前页面的pageSize
                    pageSizeCokie = pageSizeCokie.replace(oldValue, url + ":" + parseInt(this.value, 10));

                } else {
                    pageSizeCokie += url + ":" + parseInt(this.value, 10) + ";";
                }
                grv.pageSize = parseInt(this.value, 10);
                //设置cookies
                $.cookie("ListView_PageSize", pageSizeCokie, { expires: 365 });
                grv.ClearCache();
                grv.Load(1, Code.ConnType.LoadRead);
            });
            //$.cookie("ListView_PageSize", grv.pageSize);
        };

        this.Init();
        ListView._initialized = true;
    }
}

/* Date Picker Selector UI 
oDpk: 指定日历控件节点对象
iYearNum: 显示年数下拉框个数
*/
function DatePicker(oDpk, iYearNum, fCallback) {
    this.dom = {
        dpk: oDpk,
        dpkLay: new Object(),
        dpkYear: new Object(),
        dpkMonth: new Object(),
        dpkDayCot: new Object(),
        dpkPreY: new Object(),
        dpkPreM: new Object(),
        dpkNextY: new Object(),
        dpkNextM: new Object(),
        dpkInput: oDpk.find(".selector_txt"),
        dpkSeBtn: oDpk.find(".selector_btn"),
        dpkOptToday: oDpk.find(".opt-today"),
        dpkOptClear: oDpk.find(".opt-clear")
    };
    this.data = {
        dpkId: oDpk[0].id,
        dpkLayId: oDpk[0].id + "_Layer",
        dpkYearId: oDpk[0].id + "_YearDrp",
        dpkMonthId: oDpk[0].id + "_MonthDrp",
        dpkDayCotId: oDpk[0].id + "_DaysCot",
        dpkInputId: oDpk[0].id.replace(/datePicker/gi, "datePickerInput"),
        dpkSeBtnId: oDpk[0].id.replace(/datePicker/gi, "datePickerSeBtn"),
        seDate: "",
        dispTime: 2000
    };
    this.curdate = { year: 0, month: 0, day: 0, weekDay: 0, sourceDate: "" };
    this.yearNum = iYearNum;
    this.layStatus = false;
    this.callback = fCallback;
    var _d = new Date();
    if (this.dom.dpkInput.val() == "") {
        this.curdate.year = (_d).getFullYear();
        this.curdate.month = (_d).getMonth();
        this.curdate.day = (_d).getDate();
        this.curdate.weekDay = (_d).getDay();
        this.curdate.sourceDate = (_d).getFullYear() + "/" + (_d).getMonth() + "/" + (_d).getDate();
    }
    else {
        _d = new Date(this.dom.dpkInput.val().replace(/-/gi, "/"));
        this.curdate.year = (_d).getFullYear();
        this.curdate.month = (_d).getMonth();
        this.curdate.day = (_d).getDate();
        this.curdate.weekDay = (_d).getDay();
        this.curdate.sourceDate = (_d).getFullYear() + "/" + (_d).getMonth() + "/" + (_d).getDate();
    }
    if (typeof DatePicker.prototype._initialized == "undefined") {
        DatePicker.prototype.GetYearHtml = function (year) {
            var yHtml = [];
            for (var i = this.yearNum; i > 0; i--) {
                yHtml.push("<option value=\"" + (year - i) + "\">" + (year - i) + "</option>");
            }
            yHtml.push("<option value=\"" + year + "\" selected=\"selected\">" + year + "</option>");
            for (var i = 1; i <= this.yearNum; i++) {
                yHtml.push("<option value=\"" + (year + i) + "\">" + (year + i) + "</option>");
            }
            return yHtml.join("");
        };
        DatePicker.prototype.GetMonthHtml = function (month) {
            var mHtml = [];
            for (var i = 1; i < 13; i++) {
                mHtml.push(i == (month + 1) ? "<option value=\"" + i + "\" selected=\"selected\">" + i + "</option>" : "<option value=\"" + i + "\">" + i + "</option>");
            }
            return mHtml.join("");
        };
        DatePicker.prototype.GetDaysHtml = function (curDateObj) {
            var monthDays = (new Date(curDateObj.year, curDateObj.month + 1, 0)).getDate();
            var dHtml = [];
            var eachDay = 1;

            while (eachDay <= monthDays) {
                var dRowHtml = "<tr>";
                for (var i = 0; i < 7; i++) {
                    var curWeekday = new Date(curDateObj.year, curDateObj.month, eachDay);
                    if (curWeekday.getDay() == i && eachDay <= monthDays) {
                        var otd = "";
                        if (curDateObj.day == eachDay && curDateObj.month == (new Date(curDateObj.sourceDate)).getMonth() && curDateObj.year == (new Date(curDateObj.sourceDate)).getFullYear()) {
                            otd = "<td class=\"daySe\">" + eachDay + "</td>";
                        }
                        else {
                            otd = "<td class=\"\">" + eachDay + "</td>";
                        }
                        if (eachDay == (new Date()).getDate() && curDateObj.month == (new Date()).getMonth() && curDateObj.year == (new Date()).getFullYear()) {
                            otd = "<td class=\"today\">" + eachDay + "</td>";
                        }
                        dRowHtml += otd;
                        eachDay++;
                    }
                    else {
                        dRowHtml += "<td class=\"nodate\"></td>";
                    }
                }
                dRowHtml += "</tr>";
                dHtml.push(dRowHtml);
            }
            return dHtml.join("");
        };
        DatePicker.prototype.ChageDate = function (o) {
            var _self = this;
            this.dom.dpkDayCot.html(this.GetDaysHtml(o));
            this.dom.dpkYear.html(this.GetYearHtml(o.year));
            this.dom.dpkYear.blur();
            this.dom.dpkMonth.html(this.GetMonthHtml(o.month));
            this.dom.dpkMonth.blur();

            //lay controller init
            this.dom.dpkDayCot.find("td[class!='nodate']").mouseover(function () { $(this).toggleClass("dayHv", true); });
            this.dom.dpkDayCot.find("td[class!='nodate']").mouseout(function () { $(this).toggleClass("dayHv", false); });
            this.dom.dpkDayCot.find("td[class!='nodate']").click(function () {
                var seday = parseInt(this.innerHTML, 10).toString().length <= 1 ? "0" + parseInt(this.innerHTML, 10) : parseInt(this.innerHTML, 10);
                var semonth = (o.month + 1).toString().length <= 1 ? "0" + (o.month + 1) : o.month + 1;
                var sedate = o.year + "-" + semonth + "-" + seday;
                _self.dom.dpkInput.val(sedate);
                _self.CloseSelector();
                if (typeof _self.callback == "function") _self.callback();
            });
        };
        DatePicker.prototype.CloseSelector = function () {
            this.dom.dpkLay.remove();
            this.layStatus = false;
        };
        DatePicker.prototype.OpenSelector = function () {
            if (this.layStatus) return;
            this.layStatus = true;
            var dpkHtml = "<div id=\"" + this.data.dpkLayId + "\" class=\"datePicker_Layer\">";
            dpkHtml += "<div class=\"dpkLay_head\">";
            dpkHtml += "<div class=\"dpkHeadL\">";
            dpkHtml += "<a href=\"javascript:;\" hidefocus=\"true\" class=\"dpkLay_arrowBtn preYear\" id=\"preYear\"></a>";
            dpkHtml += "<a href=\"javascript:;\" hidefocus=\"true\" class=\"dpkLay_arrowBtn preMonth\" id=\"preMonth\"></a>";
            dpkHtml += "</div>";
            dpkHtml += "<div class=\"dpkHeadR\">";
            dpkHtml += "<a href=\"javascript:;\" hidefocus=\"true\" class=\"dpkLay_arrowBtn nextMonth\" id=\"nextMonth\"></a>";
            dpkHtml += "<a href=\"javascript:;\" hidefocus=\"true\" class=\"dpkLay_arrowBtn nextYear\" id=\"nextYear\"></a>";
            dpkHtml += "</div>";
            dpkHtml += "<div class=\"dpkHeadM\">";
            dpkHtml += "<select id=\"" + this.data.dpkYearId + "\">" + this.GetYearHtml(this.curdate.year) + "</select>";
            dpkHtml += "<select id=\"" + this.data.dpkMonthId + "\">" + this.GetMonthHtml(this.curdate.month) + "</select>";
            dpkHtml += "</div>";
            dpkHtml += "</div>";
            dpkHtml += "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"datePicker_Calendar\">";
            dpkHtml += "<thead><tr><th>日</th><th>一</th> <th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>";
            dpkHtml += "<tbody id=\"" + this.data.dpkDayCotId + "\">" + this.GetDaysHtml(this.curdate) + "</tbody>";
            dpkHtml += "</table>";
            dpkHtml += "<div class=\"opts\"><a href=\"javascript:;\" class=\"opt-today\">今日</a><a href=\"javascript:;\" class=\"opt-clear\">清空</a></div>";
            dpkHtml += "</div>";
            $(document.body).append(dpkHtml);
            this.dom.dpkLay = $("#" + this.data.dpkLayId);
            this.dom.dpkYear = this.dom.dpkLay.find("select#" + this.data.dpkYearId);
            this.dom.dpkMonth = this.dom.dpkLay.find("select#" + this.data.dpkMonthId);
            this.dom.dpkDayCot = this.dom.dpkLay.find("tbody#" + this.data.dpkDayCotId);
            this.dom.dpkPreY = this.dom.dpkLay.find("a#preYear");
            this.dom.dpkPreM = this.dom.dpkLay.find("a#preMonth");
            this.dom.dpkNextY = this.dom.dpkLay.find("a#nextYear");
            this.dom.dpkNextM = this.dom.dpkLay.find("a#nextMonth");
            this.dom.dpkOptToday = this.dom.dpkLay.find("a.opt-today");
            this.dom.dpkOptClear = this.dom.dpkLay.find("a.opt-clear");
            //datepicker position init
            var dpkPos = this.dom.dpk.offset();
            this.dom.dpkLay.css({ left: dpkPos.left + "px", top: (dpkPos.top + this.dom.dpk.height()) + "px", zIndex: 39999, display: "block" });
            this.dom.dpkLay.click(function (e) { e.stopPropagation(); });

            //lay controller init
            var _self = this;
            this.dom.dpkDayCot.find("td[class!='nodate']").mouseover(function () { $(this).toggleClass("dayHv", true); });
            this.dom.dpkDayCot.find("td[class!='nodate']").mouseout(function () { $(this).toggleClass("dayHv", false); });
            this.dom.dpkDayCot.find("td[class!='nodate']").click(function () {
                var seday = parseInt(this.innerHTML, 10).toString().length <= 1 ? "0" + parseInt(this.innerHTML, 10) : parseInt(this.innerHTML, 10);
                var semonth = (_self.curdate.month + 1).toString().length <= 1 ? "0" + (_self.curdate.month + 1) : _self.curdate.month + 1;
                var sedate = _self.curdate.year + "-" + semonth + "-" + seday;
                _self.dom.dpkInput.val(sedate);
                _self.CloseSelector();
                if (typeof _self.callback == "function") _self.callback();
            });

            this.dom.dpkYear.change(function () {
                _self.curdate.year = parseInt(this.options[this.selectedIndex].value, 10);
                _self.ChageDate(_self.curdate);
            });
            this.dom.dpkMonth.change(function () {
                _self.curdate.month = parseInt(this.options[this.selectedIndex].value, 10) - 1;
                _self.ChageDate(_self.curdate);
            });
            this.dom.dpkPreY.click(function () {
                _self.curdate.year = parseInt(_self.dom.dpkYear.find("option:selected").val(), 10) - 1;
                _self.ChageDate(_self.curdate);
            });
            this.dom.dpkNextY.click(function () {
                _self.curdate.year = parseInt(_self.dom.dpkYear.find("option:selected").val(), 10) + 1;
                _self.ChageDate(_self.curdate);
            });
            this.dom.dpkPreM.click(function () {
                _self.curdate.month = _self.curdate.month - 1;
                if (_self.curdate.month < 0) {
                    _self.curdate.month = 11;
                    _self.curdate.year = _self.curdate.year - 1;
                }
                _self.ChageDate(_self.curdate);
            });
            this.dom.dpkNextM.click(function () {
                _self.curdate.month = _self.curdate.month + 1;
                if (_self.curdate.month > 11) {
                    _self.curdate.month = 0;
                    _self.curdate.year = _self.curdate.year + 1;
                }
                _self.ChageDate(_self.curdate);
            });
            //今日
            this.dom.dpkOptToday.click(function () {
                var _d = new Date();
                _self.curdate.year = (_d).getFullYear();
                _self.curdate.month = (_d).getMonth();
                _self.curdate.day = (_d).getDate();
                _self.curdate.weekDay = (_d).getDay();
                _self.curdate.sourceDate = (_d).getFullYear() + "/" + (_d).getMonth() + "/" + (_d).getDate();
                var seday = parseInt(_self.curdate.day, 10).toString().length <= 1 ? "0" + parseInt(_self.curdate.day, 10) : parseInt(_self.curdate.day, 10);
                var semonth = (_self.curdate.month + 1).toString().length <= 1 ? "0" + (_self.curdate.month + 1) : _self.curdate.month + 1;
                var sedate = _self.curdate.year + "-" + semonth + "-" + seday;
                _self.dom.dpkInput.val(sedate);
                if (typeof _self.callback == "function") _self.callback();
                _self.CloseSelector();
            });
            //清空
            this.dom.dpkOptClear.click(function () {
                _self.dom.dpkInput.val("");
                _self.CloseAllLay();
            });
            //init time show
            //this.dom.dpkLay.mouseover(function() { $(window).stopTime(_self.data.dpkLayId); });
            //this.dom.dpkLay.mouseout(function() { $(window).oneTime(_self.data.dispTime, _self.data.dpkLayId, function() { _self.CloseSelector() }); });
            //this.dom.dpk.mouseover(function() { $(window).stopTime(_self.data.dpkLayId); });
            //this.dom.dpk.mouseout(function() { $(window).oneTime(_self.data.dispTime, _self.data.dpkLayId, function() { _self.CloseSelector() }); });
            //$(window).oneTime(_self.data.dispTime, _self.data.dpkLayId, function() { _self.CloseSelector() });
        };
        DatePicker.prototype.CloseAllLay = function () {
            var _self = this;
            $("div[id$='_Layer'][class='datePicker_Layer']").remove();
            _self.layStatus = false;
        };
        DatePicker.prototype.Init = function () {
            var _self = this;
            this.dom.dpkSeBtn.click(function (e) {
                if (_self.dom.dpkInput.val().length > 0) {
                    _self.curdate.sourceDate = _self.dom.dpkInput.val().replace(/-/gi, "/");
                    _self.curdate.year = (new Date(_self.curdate.sourceDate)).getFullYear();
                    _self.curdate.month = (new Date(_self.curdate.sourceDate)).getMonth();
                    _self.curdate.day = (new Date(_self.curdate.sourceDate)).getDate();
                }
                _self.CloseAllLay();
                _self.OpenSelector();
                $(document).one("click", function () {
                    _self.CloseSelector();
                });
                e.stopPropagation();
            });
        };
        this.Init();
    }
    DatePicker._initialized = true;
}

//树选择器
function TreeView(oSelector, sDatasource, ischeck, isasync, isexpl, dataparm) {
    var _o = this;
    var _check = {};
    if (ischeck) {
        _check = { enable: true, chkboxType: { "Y": "ps", "N": "ps" } };
    }
    var _async = {};
    _o.param = dataparm;
    //是否异步加载数据
    _o.nodes = [];
    if (isasync) {
        _async = {
            enable: true,
            contentType: "application/json",
            url: sDatasource,
            autoParam: _o.param ? _o.param : ["id=nodeId", "0"],
            type: "post"
        };
    }
    _o.checkRel = _check;
    _o.beforeClick = null;
    _o.onClick = null;
    _o.onCheck = null;
    _o.selector = oSelector;
    _o.tree = null;
    _o.isexpl = isexpl;
    _o.dataparm = dataparm;
    _o.datasource = sDatasource;
    _o.setting = {
        async: _async,
        check: _o.checkRel,
        callback: {
            beforeClick: function (treeId, treeNode) {
                //执行点击前事件
                if (typeof (_o.beforeClick) == "function") { _o.beforeClick(treeId, treeNode); }
            },
            onClick: function (e, treeId, treeNode) {
                //点击节点事件
                if (typeof (_o.onClick) == "function") { _o.onClick(e, treeId, treeNode); }
            },
            onCheck: function (e, treeId, treeNode) {
                if (ischeck) {
                    //选中事件
                    if (typeof (_o.onCheck) == "function") { _o.onCheck(e, treeId, treeNode); }
                }
            },
            onAsyncSuccess: function () {
                _o.selector.removeClass("treeLoading");
            }
        }
    };
    //TreeView
    if (typeof TreeView.prototype._initialized == "undefined") {
        //初始化树选择器控件
        TreeView.prototype.Init = function () {
            var _self = this;
            //_self.selector = oSelector;
            if (isasync) {
                _self.tree = $.fn.zTree.init(_self.selector, _self.setting);
            }
            else {
                var dataReq = _self.param ? _self.param : ""
                $.ajax({
                    type: "post",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: _self.datasource,
                    ifModified: false,
                    cache: false,
                    data: dataReq,
                    complete: function () { },
                    success: function (d) {
                        _self.selector.removeClass("treeLoading");
                        _self.nodes = d.d;
                        _self.setting.data = {
                            simpleData: {
                                enable: true
                            }
                        };

                        _self.tree = $.fn.zTree.init(_self.selector, _self.setting, _self.nodes);
                        if (_self.isexpl) { _self.tree.expandAll(true); }
                    },
                    error: function (a, b) {
                        //error message.
                    }
                });
            }
            //_o.tree = $.fn.zTree.init(this.selector, _o.setting, _o.nodes);
        };
        this.Init();
    };
}

//树选择器
function TreeSelector(oSelector, sDatasource, ischeck, isasync, isexpl, autoParam) {
    var _o = this;
    var _check = {};

    _o.datasource = sDatasource;
    if (ischeck) {
        _check = { enable: true, chkboxType: { "Y": "ps", "N": "ps" } };
    }
    var _async = {};
    _o.param = autoParam;
    //是否异步加载数据
    _o.nodes = [];
    if (isasync) {
        _async = {
            enable: true,
            contentType: "application/json",
            url: _o.datasource,
            autoParam: _o.param ? _o.param : ["id=nodeId", "0"],
            type: "post"
        };
    }

    _o.beforeClick = null;
    _o.onClick = null;
    _o.onCheck = null;
    _o.isexpl = isexpl;
    _o.selector = oSelector;
    _o.tree = null;
    _o.setting = {
        async: _async,
        check: _check,
        callback: {
            beforeClick: function (treeId, treeNode) {
                var _self = _o;
                //执行点击前事件
                if (typeof (_self.beforeClick) == "function") { _self.beforeClick(treeId, treeNode); }
            },
            onClick: function (e, treeId, treeNode) {
                var _self = _o;
                //点击节点事件
                if (typeof (_self.onClick) == "function") { _self.onClick(e, treeId, treeNode); }
            },
            onCheck: function (e, treeId, treeNode) {
                var _self = _o;
                if (ischeck) {
                    //选中事件
                    if (typeof (_self.onCheck) == "function") { _self.onCheck(e, treeId, treeNode); }
                }
            },
            onAsyncSuccess: function () {
                $(".treeSelectorLay").removeClass("treeLoading");
            }
        }
    };
    if (typeof TreeSelector.prototype._initialized == "undefined") {
        //生成树节点
        TreeSelector.prototype.GenerateHtml = function () {
            var html = [];
            html.push('<div class="treeSelectorLay treeLoading"><ul id="treeSelectorNodes" class="ztree"></ul></div>');
            return html.join('');
        };
        TreeSelector.prototype.CloseLay = function () {
            $(".treeSelectorLay").fadeOut("fast", function () { $(".treeSelectorLay").remove(); });
        };
        TreeSelector.prototype.GetLayPos = function (o, lay) {
            var pos = { left: o.selector.position().left, top: (o.selector.position().top + o.selector.height()) - 1 };
            if (($(window).height() - (pos.top - $(window).scrollTop())) >= lay.outerHeight()) {
                return pos;
            }
            else {
                if ((o.selector.position().top - $(window).scrollTop()) > lay.outerHeight()) {
                    pos.top = (o.selector.position().top - lay.outerHeight()) + 1;
                }
            }
            return pos;
        };
        TreeSelector.prototype.Open = function () {
            var _self = _o;
            //生成树选择层节点
            if ($(".treeSelectorLay").length > 0) { return; }
            $(document.body).append(_self.GenerateHtml());
            var pos = _self.GetLayPos(_self, $(".treeSelectorLay"));
            $(".treeSelectorLay").css({ left: pos.left + "px", top: pos.top + "px", width: (_self.selector.outerWidth() - 2) + "px" }).slideDown("fast");
            if (isasync) {
                _self.tree = $.fn.zTree.init($(".treeSelectorLay").find("#treeSelectorNodes"), _self.setting);
            }
            else {
                var dataReq = _self.param ? _self.param : "";
                $.ajax({
                    type: "post",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: _self.datasource,
                    ifModified: false,
                    cache: false,
                    data: dataReq,
                    complete: function () { },
                    success: function (d) {
                        $(".treeSelectorLay").removeClass("treeLoading");
                        _self.nodes = d.d;
                        _self.setting.data = {
                            simpleData: {
                                enable: true
                            }
                        };

                        _self.tree = $.fn.zTree.init($(".treeSelectorLay").find("#treeSelectorNodes"), _self.setting, _self.nodes);
                        if (_self.isexpl) { _self.tree.expandAll(true); }

                        //绑定已选
                        var seVal = _self.selector.attr("nodeid");
                        if (seVal.length >= 0) {
                            var nodeids = seVal.split(",");
                            for (var i = 0; i < nodeids.length; i++) {
                                if (typeof (_self.tree.getNodesByParam("id", nodeids[i])[0]) == "undefined") { continue; }
                                _self.tree.checkNode(_self.tree.getNodesByParam("id", nodeids[i])[0], true, true);
                            }
                        }
                    },
                    error: function (a, b) {
                        //error message.
                    }
                });
            }
            //关闭层
            $(document.body).unbind("click");
            $(document.body).bind("click", function (event) {
                if (!(event.target == _self.selector.find(".selector_btn")[0] ||
                    event.target == _self.selector.find(".selector_txt")[0] ||
                    event.target == _self.selector[0] ||
                    event.target.id == "treeSelectorNodes" || $(event.target).parents(".treeSelectorLay").length > 0)) {
                    _self.CloseLay();
                }
            });
        };
        //初始化树选择器控件
        TreeSelector.prototype.Init = function () {
            var _self = this;
            this.selector = oSelector;
            this.selector.find(".selector_btn").unbind("click");
            this.selector.find(".selector_btn").bind("click", _self.Open);
        };
        this.Init();
    };
}

//树选择器
function SectionStep(nodes, location) {
    var _o = this;
    _o.nodes = [{ section: new Object(), pid: "", name: "" }];
    _o.location = location;
    _o.sectionStep = {};
    _o.sectionItem = {};
    if (typeof SectionStep.prototype._initialized == "undefined") {
        //生成树节点
        SectionStep.prototype.GenerateHtml = function (nodes) {
            var html = [];
            html.push('<div class="form-sect-step">');
            html.push('<div class="form-sect-step-wrap">');
            for (var i = 0; i < nodes.length; i++) {
                html.push('<a href="javascript:;"' + (i == 0 ? ' class="se"' : '') + ' pid="' + nodes[i].pid + '">' + nodes[i].name + '</a>');
            }
            html.push('<a href="javascript:;" class="opt btm"></a>');
            html.push('<a href="javascript:;" class="opt top"></a>');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
        };
        SectionStep.prototype.GetSection = function (pid) {
            for (var i = 0; i < _o.nodes.length; i++) {
                if (_o.nodes[i].pid == pid) { return _o.nodes[i].section; }
            }
        };
        SectionStep.prototype.Close = function () {
            $(".form-sect-step").remove();
        };
        SectionStep.prototype.Init = function () {
            if ($(".form-sect-step").length > 0) { $(".form-sect-step").remove(); }
            _o.nodes = nodes;
            if (_o.location) {
                _o.location.before(_o.GenerateHtml(_o.nodes));
            }
            else {
                $(document.body).append(_o.GenerateHtml(_o.nodes));
            }
            _o.sectionStep = $(".form-sect-step");
            _o.sectionItem = $(".form-sect-step a:not([class^='opt'])");
            //_o.sectionStep.css({ top: (($(window).height() - _o.sectionStep.height() - 1) + $(window).scrollTop()) + "px" });

            _o.sectionItem.click(function () {
                var pid = $(this).attr("pid");
                var section = _o.GetSection(pid);
                $("html").animate({
                    scrollTop: section.position().top - _o.sectionStep.height(),
                    easing: 'easeOutSine',
                    duration: 300
                });
            });
            _o.sectionStep.find(".btm").click(function () {
                $("html").animate({
                    scrollTop: $(document).height() - $(window).height(),
                    easing: 'easeOutSine',
                    duration: 300
                });
            });
            _o.sectionStep.find(".top").click(function () {
                $("html").animate({
                    scrollTop: 0,
                    easing: 'easeOutSine',
                    duration: 300
                });
            });

            $(window).scroll(function () {
                //设置控件位置
                if ($(window).scrollTop() > (_o.sectionStep.height() + 15)) {
                    _o.sectionStep.find(".form-sect-step-wrap").css({ top: "0px", position: "fixed" });
                }
                else {
                    _o.sectionStep.find(".form-sect-step-wrap").css({ top: "0px", position: "relative" });
                }
                for (var i = 0; i < _o.nodes.length; i++) {
                    var section = _o.nodes[i].section;
                    if (section.position().top < ($(window).scrollTop() + 1 + _o.sectionStep.height())) {
                        _o.sectionStep.find("a[pid='" + _o.nodes[i].pid + "']").addClass("se");
                        _o.sectionStep.find("a[pid='" + _o.nodes[i].pid + "']").siblings().removeClass("se");
                    }
                }
            });
        };
        this.Init();
    };
}

//线路详情选择器
function RouteSectionStep(nodes, location) {
    var _o = this;
    _o.nodes = [{ section: new Object(), pid: "", name: "" }];
    _o.location = location;
    _o.sectionStep = {};
    _o.sectionItem = {};
    if (typeof RouteSectionStep.prototype._initialized == "undefined") {
        //生成树节点
        RouteSectionStep.prototype.GenerateHtml = function (nodes) {
            var html = [];
            html.push('<div class="rd-head">');
            html.push('<div class="rd-head-wrap">');
            html.push('<div class="rdp-head">');
            html.push('<div class="logo"></div>');
            html.push('<div class="opts">');
            html.push('<a href="javascript:;"><i class="print"></i><em>打印</em></a>');
            html.push('<a href="javascript:PageUI.Download();"><i class="download"></i><em>Word下载</em></a>');
            html.push('<a href="javascript:PageUI.Booking();"><i class="reservations"></i><em>预订</em></a>');
            html.push('</div></div>');
            html.push('<div class="menu">');
            for (var i = 0; i < nodes.length; i++) {
                html.push('<a href="javascript:;"' + (i == 0 ? ' class="se"' : '') + ' pid="' + nodes[i].pid + '">' + nodes[i].name + '</a>');
            }
            html.push('</div>');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
        };
        RouteSectionStep.prototype.GetSection = function (pid) {
            for (var i = 0; i < _o.nodes.length; i++) {
                if (_o.nodes[i].pid == pid) { return _o.nodes[i].section; }
            }
        };
        RouteSectionStep.prototype.Close = function () {
            $(".rd-head").remove();
        };
        RouteSectionStep.prototype.Init = function () {
            if ($(".rd-head").length > 0) { $(".rd-head").remove(); }
            _o.nodes = nodes;
            if (_o.location) {
                _o.location.before(_o.GenerateHtml(_o.nodes));
            }
            else {
                $("div.rd-main").before(_o.GenerateHtml(_o.nodes));
            }
            _o.sectionStep = $(".rd-head");
            _o.sectionItem = $(".menu a:not([class^='opt'])");
            //_o.sectionStep.css({ top: (($(window).height() - _o.sectionStep.height() - 1) + $(window).scrollTop()) + "px" });

            _o.sectionItem.click(function () {
                var pid = $(this).attr("pid");
                var section = _o.GetSection(pid);
                $("html").animate({
                    scrollTop: section.position().top - _o.sectionStep.height(),
                    easing: 'easeOutSine',
                    duration: 300
                });
            });

            $(window).scroll(function () {
                //设置控件位置
                if ($(window).scrollTop() > (_o.sectionStep.height() + 15)) {
                    _o.sectionStep.css({ top: "0px", position: "fixed" });
                }
                else {
                    _o.sectionStep.css({ top: "0px", position: "fixed" });
                }
                for (var i = 0; i < _o.nodes.length; i++) {
                    var section = _o.nodes[i].section;
                    if (section.position().top < ($(window).scrollTop() + 1 + _o.sectionStep.height())) {
                        _o.sectionStep.find("a[pid='" + _o.nodes[i].pid + "']").addClass("se");
                        _o.sectionStep.find("a[pid='" + _o.nodes[i].pid + "']").siblings().removeClass("se");
                    }
                }
            });
        };
        this.Init();
    };
}

//
/*
@ Control Name: 下拉框 客户端控件
@ Author: 金亚军
@ Develop Date: 2010.06.11
@ Parameter:
textbox         输入框控件
datasource      输入时要查询的数据源
isFocusLoad     是否启用得到焦点即进行数据查询
layw            控制查询结果弹出层显示宽度（默认为输入控件宽度）
maxItem         控制查询结果最大显示个数（更新数据会有滚动条）
parameter       数据查询接口参数（格式：为数组例如[{key:value},.....]）
@ Property:
pageIndex       当前页
pageSize        一页显示记录数
pageCount       总分页数(只读)
recordCount     总记录数(只读)
columnField     列字段名集合
*/
function Combox(textbox, datasource, isFocusLoad, layw, maxItem, parameter, callback, change) {
    var _o = this;
    _o.combox = textbox;
    _o.lay = null;
    _o.container = null;
    _o.timeid = null;
    _o.datasource = datasource;
    _o.parameter = typeof (parameter) == "undefined" || parameter == null ? null : parameter;;
    _o.maxItem = typeof (maxItem) == "undefined" || maxItem == null ? 5 : maxItem;
    _o.delay = typeof (delay) == "undefined" || delay == null ? 500 : delay;
    _o.layWidth = typeof (layw) == "undefined" || layw == null ? 0 : layw;//默认弹出层宽度按输入框宽度
    _o.isFocusLoad = typeof (isFocusLoad) == "undefined" || isFocusLoad == null ? false : isFocusLoad;
    _o.callback = typeof (callback) == "undefined" || callback == null ? null : callback;
    _o.change = typeof (change) == "undefined" || change == null ? null : change;
    _o.httpReq = null;
    _o.selectedData = null;
    if (typeof Combox.prototype._initialized == "undefined") {
        //生成树节点
        Combox.prototype.GenerateHtml = function () {
            var html = [];
            html.push('<div class="combox-lay">');
            html.push('<div class="container">');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
        };
        Combox.prototype.Close = function () {
            if (this.lay) { this.lay.remove(); this.lay = null; }
            if (this.container) { this.container.remove(); this.container = null; }
        }
        Combox.prototype.Init = function () {
            var _self = this;
            if ($(".combox-lay").length > 0) { return; }
            _self.combox.unbind(); 
            if (typeof (_self.combox.attr("val")) == "undefined") {
                _self.combox.attr("val", "");
            }
            _self.combox.bind("keydown", function (e) {
                //移动光标设置选项
                if (e.keyCode == 38) {
                    //向上
                    if (_self.lay.length <= 0) { return; }
                    if (_self.container.find("a").length <= 0) { return; }
                    var next = _self.container.find("a")[_self.container.find("a.se").index() - 1];
                    if (typeof (next) == "undefined") { return; }
                    _self.container.find("a").removeClass("se");
                    $(next).addClass("se");
                    if ($(next).position().top < 0 && $(next).parent().scrollTop() > 0) {
                        $(next).parent().scrollTop($(next).parent().scrollTop() - $(next).outerHeight());
                    }
                }
                if (e.keyCode == 40) {
                    //向下
                    if (_self.lay.length <= 0) { return; }
                    if (_self.container.find("a").length <= 0) { return; }
                    var next = _self.container.find("a")[_self.container.find("a.se").index() + 1];
                    if (typeof (next) == "undefined") { return; }
                    _self.container.find("a").removeClass("se");
                    $(next).addClass("se");
                    if ($(next).position().top + $(next).parent().scrollTop() + $(next).outerHeight() > _self.container.height()) {
                        $(next).parent().scrollTop($(next).position().top + $(next).parent().scrollTop() + $(next).outerHeight() - _self.container.height());
                    }
                }
                if (e.keyCode == 13) {
                    //回车
                    $(this).attr("val", _self.container.find("a.se").attr("value"));
                    $(this).val(_self.container.find("a.se").text());
                    _self.Close();
                    return false;
                }
            });
            _self.combox.bind("click", function (e) { e.stopPropagation(); });
            _self.combox.bind("focus", function (e) {
                e.stopPropagation();
                var _this = this;
                if (_self.isFocusLoad) {
                    if (_self.timeid != null) { clearTimeout(_self.timeid); }
                    _self.timeid = setTimeout(function () {

                        var dataReq = { name: _this.value };
                        //组装自定义参数
                        if (_self.parameter != null) {
                            for (var p in _self.parameter) {
                                var item = _self.parameter[p];
                                dataReq[p] = item;
                            }
                        }
                        if (_self.httpReq != null) { _self.httpReq.abort(); }
                        _self.httpReq = AjaxPost($.toJSON(dataReq), _self.datasource, function (d) {
                            //clear old data
                            if (_self.container) { _self.container.html(""); }
                            //debugger;
                            var json = d.d;
                            if (json == null)
                            {
                                return;
                            }
                            if (json.length > 0) {
                                //create lay
                                if (_self.lay == null) {
                                    $(document.body).append(_self.GenerateHtml());
                                    $(document.body).click(function (e) { _self.Close(); });
                                }
                                //lay position
                                _self.lay = $(".combox-lay");
                                _self.container = _self.lay.find(".container");
                                var top = _self.combox.position().top + _self.combox.outerHeight() - 1;
                                var left = _self.combox.position().left;
                                var width = _self.layWidth <= 0 ? _self.combox.outerWidth() - 2 : _self.layWidth;
                                var itemNum = json.length > _self.maxItem ? _self.maxItem : json.length;
                                var height = itemNum * 25;
                                _self.lay.css({ top: top + "px", left: left + "px", width: width + "px", height: height + "px" });
                                _self.container.css({ width: width + "px", height: height + "px" });
                                //gen data element
                                var html = [];
                                for (var i = 0; i < json.length; i++) {
                                    html.push('<a href="javascript:;" value="' + json[i].id + '">' + json[i].name + '</a>');
                                }
                                _self.container.html(html.join(''));
                                //click item
                                _self.container.find("a").click(function () {
                                    var _this = $(this);
                                    _self.combox.attr("val", _this.attr("value"));
                                    _self.combox.val(_this.text());
                                    _self.selectedData = json[_self.container.find("a").index(_this)];
                                    //do callback
                                    if (typeof (_self.callback) == "function") { _self.callback(_self.selectedData); }
                                    _self.Close();
                                });
                            }
                            else {
                                _self.Close();
                            }
                        });
                    }, 100);
                }
            });
            _self.combox.bind("keyup", function (e) {
                var _this = this;
                if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13) { return false; }

                if (_self.timeid != null) { clearTimeout(_self.timeid); }
                _self.timeid = setTimeout(function () {
                    $(_this).attr("val", "");
                    if (typeof (_self.change) == "function") { _self.change(_this.value); }
                    var dataReq = { name: _this.value };
                    //组装自定义参数
                    if (_self.parameter != null) {
                        for (var p in _self.parameter) {
                            var item = _self.parameter[p];
                            dataReq[p] = item;
                        }
                    }
                    if (_self.httpReq != null) { _self.httpReq.abort(); }

                    _self.httpReq = AjaxPost($.toJSON(dataReq), _self.datasource, function (d) {
                        //clear old data
                        if (_self.container) { _self.container.html(""); }
                        //debugger;
                        var json = d.d;
                        if (json == null) {
                            return;
                        }
                        if (json.length > 0) {
                            //create lay
                            if (_self.lay == null) {
                                $(document.body).append(_self.GenerateHtml());
                                $(document.body).click(function (e) { _self.Close(); });
                            }
                            //lay position
                            _self.lay = $(".combox-lay");
                            _self.container = _self.lay.find(".container");
                            var top = _self.combox.position().top + _self.combox.outerHeight() - 1;
                            var left = _self.combox.position().left;
                            var width = _self.layWidth <= 0 ? _self.combox.outerWidth() - 2 : _self.layWidth;
                            var itemNum = json.length > _self.maxItem ? _self.maxItem : json.length;
                            var height = itemNum * 25;
                            _self.lay.css({ top: top + "px", left: left + "px", width: width + "px", height: height + "px" });
                            _self.container.css({ width: width + "px", height: height + "px" });
                            //gen data element
                            var html = [];
                            for (var i = 0; i < json.length; i++) {
                                html.push('<a href="javascript:;" value="' + json[i].id + '">' + json[i].name + '</a>');
                            }
                            _self.container.html(html.join(''));
                            //click item
                            _self.container.find("a").click(function () {
                                var _this = $(this);
                                _self.combox.attr("val", _this.attr("value"));
                                _self.combox.val(_this.text());
                                _self.selectedData = json[_self.container.find("a").index(_this)];
                                //do callback
                                if (typeof (_self.callback) == "function") { _self.callback(_self.selectedData); }

                                _self.Close();
                            });
                        }
                        else {
                            _self.Close();
                        }
                    });
                }, 100);
            });
        };
        _o.Init();
    };
}

/*
@ Control Name: 下拉框 客户端控件
@ Author: 金亚军
@ Develop Date: 2010.06.11
@ Parameter:
textbox         输入框控件
datasource      输入时要查询的数据源
isFocusLoad     是否启用得到焦点即进行数据查询
maxItem         控制查询结果最大显示个数（更新数据会有滚动条）
parameter       数据查询接口参数（格式：为数组例如[{key:value},.....]）
@ Property:
pageIndex       当前页
pageSize        一页显示记录数
pageCount       总分页数(只读)
recordCount     总记录数(只读)
columnField     列字段名集合
*/
function DropDownList(textbox, isFocusLoad, layw, callback, isSearch, maxItem) {
    var _o = this;
    _o.combox = textbox;
    _o.lay = null;
    _o.container = null;
    _o.timeid = null;
    _o.maxItem = typeof (maxItem) == "undefined" || maxItem == null ? 5 : maxItem;
    _o.delay = typeof (delay) == "undefined" || delay == null ? 500 : delay;
    _o.layWidth = typeof (layw) == "undefined" || layw == null ? 0 : layw;//默认弹出层宽度按输入框宽度
    _o.isFocusLoad = typeof (isFocusLoad) == "undefined" || isFocusLoad == null ? false : isFocusLoad;
    _o.callback = typeof (callback) == "undefined" || callback == null ? null : callback;
    _o.isSearch = typeof (isSearch) == "undefined" || isSearch == null ? null : isSearch;
    if (typeof DropDownList.prototype._initialized == "undefined") {
        //生成树节点
        DropDownList.prototype.GenerateHtml = function () {
            var html = [];
            html.push('<div class="combox-lay">');
            html.push('<div class="container">');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
        };
        DropDownList.prototype.Close = function () {
            if (this.lay) { this.lay.remove(); this.lay = null; }
            if (this.container) { this.container.remove(); this.container = null; }
        }
        DropDownList.prototype.Init = function () {
            var _self = this;
            if ($(".combox-lay").length > 0) { return; }
            _self.combox.unbind(); 
           
            if (_self.combox.attr("val") == "undefined" || _self.combox.attr("val") == "") {
                _self.combox.attr("val", "");
            }
             
            _self.combox.bind("keydown", function (e) {
                //移动光标设置选项
                if (e.keyCode == 38) {
                    //向上
                    if (_self.lay.length <= 0) { return; }
                    if (_self.container.find("a").length <= 0) { return; }
                    var next = _self.container.find("a")[_self.container.find("a.se").index() - 1];
                    if (typeof (next) == "undefined") { return; }
                    _self.container.find("a").removeClass("se");
                    $(next).addClass("se");
                    if ($(next).position().top < 0 && $(next).parent().scrollTop() > 0) {
                        $(next).parent().scrollTop($(next).parent().scrollTop() - $(next).outerHeight());
                    }
                }
                if (e.keyCode == 40) {
                    //向下
                    if (_self.lay.length <= 0) { return; }
                    if (_self.container.find("a").length <= 0) { return; }
                    var next = _self.container.find("a")[_self.container.find("a.se").index() + 1];
                    if (typeof (next) == "undefined") { return; }
                    _self.container.find("a").removeClass("se");
                    $(next).addClass("se");
                    if ($(next).position().top + $(next).parent().scrollTop() + $(next).outerHeight() > _self.container.height()) {
                        $(next).parent().scrollTop($(next).position().top + $(next).parent().scrollTop() + $(next).outerHeight() - _self.container.height());
                    }
                }
                if (e.keyCode == 13) {
                    //回车
                    $(this).attr("val", _self.container.find("a.se").attr("value"));
                    $(this).val(_self.container.find("a.se").text());
                    _self.Close();
                    return false;
                }
            });
            _self.combox.bind("click", function (e) { e.stopPropagation(); });
            _self.combox.bind("focus", function (e) {
                e.stopPropagation();
                var _this = this;
                if (_self.isFocusLoad) {
                    if (_self.timeid != null) { clearTimeout(_self.timeid); }
                    _self.timeid = setTimeout(function () {
                        
                        if (_self.container) { _self.container.html(""); }
                        var val = _o.combox.attr("data");
                        var json = $.secureEvalJSON(val);
                        if (json.length > 0) {
                            //create lay
                            if (_self.lay == null) {
                                $(document.body).append(_self.GenerateHtml());
                                $(document.body).click(function (e) { _self.Close(); });
                            }
                            //lay position
                            _self.lay = $(".combox-lay");
                            _self.container = _self.lay.find(".container");
                            var top = _self.combox.position().top + _self.combox.outerHeight() - 1;
                            var left = _self.combox.position().left;
                            var width = _self.layWidth <= 0 ? _self.combox.outerWidth() - 2 : _self.layWidth;
                            var itemNum = json.length > _self.maxItem ? _self.maxItem : json.length;
                            var height = itemNum * 25;
                            _self.lay.css({ top: top + "px", left: left + "px", width: width + "px", height: height + "px" });
                            _self.container.css({ width: width + "px", height: height + "px" });
                            //gen data element
                            var html = [];
                            for (var i = 0; i < json.length; i++) {
                                if (_o.isSearch) {
                                    if (json[i].text.indexOf(_this.value) >= 0) {
                                        html.push('<a href="javascript:;" value="' + json[i].value + '">' + json[i].text + '</a>');
                                    }
                                } else {
                                    html.push('<a href="javascript:;" value="' + json[i].value + '">' + json[i].text + '</a>');
                                }
                            }
                            _self.container.html(html.join(''));
                            //click item
                            _self.container.find("a").click(function () {
                                var _this = $(this);
                                _self.combox.attr("val", _this.attr("value"));
                                _self.combox.val(_this.text());
                                
                                //do callback
                                if (typeof (_self.callback) == "function") { _self.callback(_self.selectedData); }
                                _self.Close();
                            });
                        }
                        else {
                            _self.Close();
                        }
                    }, 100);
                }
            });
            _self.combox.bind("keyup", function (e) {
                var _this = this;
                if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13) { return false; }

                if (_self.timeid != null) { clearTimeout(_self.timeid); }
                _self.timeid = setTimeout(function () {
                   
                    if (_self.container) { _self.container.html(""); }
                    var val = _o.combox.attr("data");
                    var json = eval("(" + val + ")");
                    if (json.length > 0) {
                        //create lay
                        if (_self.lay == null) {
                            $(document.body).append(_self.GenerateHtml());
                            $(document.body).click(function (e) { _self.Close(); });
                        }
                        //lay position
                        _self.lay = $(".combox-lay");
                        _self.container = _self.lay.find(".container");
                        var top = _self.combox.position().top + _self.combox.outerHeight() - 1;
                        var left = _self.combox.position().left;
                        var width = _self.layWidth <= 0 ? _self.combox.outerWidth() - 2 : _self.layWidth;
                        var itemNum = json.length > _self.maxItem ? _self.maxItem : json.length;
                        var height = itemNum * 25;
                        _self.lay.css({ top: top + "px", left: left + "px", width: width + "px", height: height + "px" });
                        _self.container.css({ width: width + "px", height: height + "px" });
                        //gen data element
                        var html = [];
                        for (var i = 0; i < json.length; i++) {
                            if (_o.isSearch) {
                                if (json[i].text.indexOf(_this.value) >= 0) {
                                    html.push('<a href="javascript:;" value="' + json[i].value + '">' + json[i].text + '</a>');
                                }
                            } else {
                                html.push('<a href="javascript:;" value="' + json[i].value + '">' + json[i].text + '</a>');
                            }
                        }
                        _self.container.html(html.join(''));
                        //click item
                        _self.container.find("a").click(function () {
                            var _this = $(this);
                            _self.combox.attr("val", _this.attr("value"));
                            _self.combox.val(_this.text());
                               
                            if (typeof (_self.callback) == "function") { _self.callback(_self.selectedData); }

                            _self.Close();
                        });
                    }
                    else {
                        _self.Close();
                    }
                }, 100);
            }); 
        };
        _o.Init();
    };
    
}

function TourDate(oDpk, dateTime, url, dataReq, sDataSource, fCallback) {
    //debugger;
    var _self = this;
    this.dom = {
        dpk: oDpk,
        dateTime: dateTime,
        sDataSource: sDataSource,
        prev: oDpk.find("a.prev"),//上一月
        next: oDpk.find("a.next"), //下一月
        month: oDpk.find(".calendar-head b"),//显示月份
        tbody: oDpk.find(".calendar-body tbody"),
        yearStr: dateTime.getFullYear(),
        monthStr: "",
        dataReq: dataReq,
        departureDateList: [],
        sDataSource: sDataSource,
        url: url
    };
    this.callback = fCallback;
    //
    TourDate.prototype.Init = function () {
        var _self = this;
        _self.dom.monthStr = _self.PadLeft((dateTime.getMonth() + 1), 2);
        _self.CreateDate();
        this.dom.next.bind("click", _self.Next);
    };
    TourDate.prototype.CreateDate = function () {
        var _self = this;
        var search = {
            ConnType: 0,
            PageIndex: 0,
            PageSize: 0,
            Columns: [],
            Condition: _self.dom.dataReq
        };
        var sdata = $.toJSON({ search: search });
        $.ajax({
            type: "post",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: _self.dom.sDataSource,
            ifModified: false,
            cache: false,
            async: false,//同步请求
            data: sdata,
            success: function (data) {
                _self.dom.departureDateList = data.d.split(',');
            },
            error: function (a, b) {
                //error message.
            }
        });

        var date = new Date(_self.dom.yearStr + "/" + _self.dom.monthStr + "/01");
        date.setMonth(date.getMonth());
        var index = date.getDay();
        var days = _self.DayNumOfMonth(date.getFullYear(), date.getMonth() + 1);
        var days2 = index + days;
        var tail = 0;
        if ((days2 % 7) != 0) {
            tail = 7 - (days2 % 7);
        }
        var dateMonth = date.getMonth() + 1;
        var dateYear = date.getFullYear();
        var day = 1;
        var tail2 = 1;
        var html = [];
        for (var i = 1; i <= (days2 + tail) / 7; i++) {
            html.push("<tr>");
            for (var j = (i - 1) * 7 + 1; j <= i * 7; j++) {
                if (j <= index) {
                    html.push("<td><div></div></td>");
                }
                else {
                    if (day <= days) {
                        var val = _self.dom.yearStr + "-" + _self.dom.monthStr + "-" + _self.PadLeft(day, 2);
                        var departureIndex = $.inArray(val, _self.dom.departureDateList);
                        var date3 = new Date(val.replace(/-/g, "/"));
                        var csl = "";
                        //debugger;
                        if (_self.dom.dateTime - date3 == 0) {
                            csl = "today ";
                        }
                        if (departureIndex >= 0) {
                            html.push("<td class=\"" + csl + "tours\" day=\"" + val + "\"><div><i></i>" + day + "</div></td>");
                        }
                        else {
                            html.push("<td class=\"" + csl + "\" day=\"" + val + "\"><div>" + day + "</div></td>");
                        }
                    }
                    else {
                        if (tail2 <= tail) {
                            html.push("<td><div></div></td>");
                        }
                        tail2++;
                    }
                    day++;
                }
            }
            html.push("</tr>");
        }

        var currentdate = dateTime;
        if (date <= currentdate) {
            _self.dom.prev.unbind("click");
        }
        else {
            _self.dom.prev.unbind("click");
            _self.dom.prev.bind("click", _self.Last);
        }
        _self.dom.month.attr("month", date.getFullYear() + "/" + _self.PadLeft((date.getMonth() + 1), 2) + "/01");
        _self.dom.month.html(date.getFullYear() + "年" + _self.PadLeft((date.getMonth() + 1), 2) + "月");
        _self.dom.tbody.html(html.join(''));
        _self.dom.tbody.find("td.tours").bind("click", function () {
            var url = "";
            url = _self.dom.url + "?dateGo=" + $(this).attr("day");
            if (_self.dom.dataReq.desGuid.length > 0) {
                url += "&firstAreaId=" + _self.dom.dataReq.desGuid;
            }
            if (_self.dom.dataReq.subDesGuid.length > 0) {
                url += "&secondAreaId=" + _self.dom.dataReq.subDesGuid;
            }
            if (typeof (_self.dom.dataReq.supplierGuid) == "string") {
                url += "&supplierId=" + _self.dom.dataReq.supplierGuid;
            }
            window.open(url);
        });
    };
    TourDate.prototype.PadLeft = function (str, lenght) {
        var _self = this;
        if ((str + "").length == lenght) {
            return str;
        }
        else {
            return _self.PadLeft("0" + str, lenght);
        }
    };
    TourDate.prototype.DayNumOfMonth = function (Year, Month) {
        var d = new Date(Year, Month, 0);
        return d.getDate();
    };
    TourDate.prototype.Next = function () {
        var dateStr = _self.dom.month.attr("month");
        var date = new Date(dateStr.replace(/-/g, "/"));
        date.setMonth(date.getMonth() + 1);
        _self.dom.monthStr = _self.PadLeft((date.getMonth() + 1), 2);
        _self.dom.yearStr = date.getFullYear();

        _self.dom.dataReq.year = _self.dom.yearStr;
        _self.dom.dataReq.month = date.getMonth() + 1;
        _self.CreateDate();
    }
    TourDate.prototype.Last = function () {
        var dateStr = _self.dom.month.attr("month");
        var date = new Date(dateStr.replace(/-/g, "/"));
        date.setMonth(date.getMonth() - 1);
        _self.dom.monthStr = _self.PadLeft((date.getMonth() + 1), 2);
        _self.dom.yearStr = date.getFullYear();
        _self.dom.dataReq.year = _self.dom.yearStr;
        _self.dom.dataReq.month = date.getMonth() + 1;
        _self.CreateDate();
    }
    this.Init();
}
window.com = $.com = {
    _cGetUrlParam: function (C) {
        var B = new RegExp("(^|&)" + C + "=([^&]*)(&|$)");
        var A = window.location.search.substr(1).toLowerCase().match(B);
        if (A != null) {
            return unescape(A[2])
        }
        return null;
    }
}



/*
时间选择控件
=======================================================
params:$dom
return:
*/
function TimePicker($dom) {
    this.dom = $dom;
    return this;
};
TimePicker.prototype = {
    /*
    渲染方法
    =======================================================
    params:时间间隔（分钟数），选项框的高度
    return:
    */
    render: function (timeDivision, domHeight) {
        var $dom = this.dom;
        var tagObj = this;

        /*循环遍历过程*/
        $.each($dom, function (key, value) {
            ; +function () {
                /*添加类似select的组件*/
                var $main = $("<div class='main-moment'></div>");
                var $select = $("<div class='main-select'></div>");
                /*select添加样式*/
                $select.height(domHeight);
                $select.width($(value).outerWidth() - 2).hide();
                $main.width($(value).outerWidth());

                /*插入页面中*/
                $main.insertAfter($(value));
                $main.append($(value));
                $main.append($select);


                /*给select添加时间选项*/
                var startMinu = 0;
                var startHour = 0;

                while (startHour < 24) {
                    var minuStr = (startMinu + "").length > 1 ? (startMinu + "") : "0" + startMinu;
                    var hourStr = (startHour + "").length > 1 ? (startHour + "") : "0" + startHour;

                    /*模拟选项*/
                    var temoOption =
                    $("<div value='" + (hourStr + ":" + minuStr) + "' class='answers'>" + (hourStr + ":" + minuStr) + "</div>");
                    $select.append(temoOption);

                    /*分钟，小时的迭代计算*/
                    startMinu += timeDivision;
                    if (startMinu >= 60) {
                        startMinu -= 60;
                        startHour += 1;
                    }
                }


                var optionLength = $select.find(".answers").length;
                var optionHeight = $select.find(".answers").outerHeight();
                /*
                input添加click事件
                1，点击后elect出现
                2，出现时document绑定keydown事件，消失时解除
                */
                $select.prev().off("click").on("click", function () {
                    if ($(this).next().css("display") !== "none") {
                        $(this).next().hide();
                        /*解除键盘滚动事件*/
                        // $main.off("keydown");
                    } else {
                        $select.find(".answers").toggleClass("active", false);
                        $(this).next().show().scrollTop(0)
                        .find(".answers").eq(0).toggleClass("active", true);
                    }
                    return false;
                });
                /*
               选项添加click事件
               1，改变input的值
               2，select消失
               */
                $select.find(".answers").on("click", function () {
                    $(this).parent().hide().prev().val($(this).attr("value")).end()
                    .find(".answers").toggleClass("active", false);

                    return false;
                });
                /*
               选项添加hover事件
               1，加上class：active
               */
                $select.find(".answers").on("mouseover", function () {
                    $select.find(".answers").toggleClass("active", false);
                    $(this).toggleClass("active", true);
                });
                // $select.find(".answers").on("mouseout", function () {
                //     $(this).toggleClass("active",false);
                // });

                /*
                 绑定键盘滚动事件
                 1，选项向上向下
                */
                $main.on("keydown", function (event) {
                    // console.log(event.keyCode);
                    var tempScrollTop = $select.scrollTop();
                    var old_active = $select.find(".answers.active");
                    /*向上*/
                    if (event.keyCode === 38) {
                        if (tempScrollTop > 0) {
                            tempScrollTop -= optionHeight;
                            old_active.prev().trigger("mouseover");
                            $select.scrollTop(tempScrollTop);
                        } else {
                            if (old_active.index() > 0) {
                                old_active.prev().trigger("mouseover");
                            }
                        }
                    }
                    /*向下*/
                    if (event.keyCode === 40) {
                        if (tempScrollTop < optionHeight * optionLength) {
                            tempScrollTop += optionHeight;
                            old_active.next().trigger("mouseover");
                            $select.scrollTop(tempScrollTop);
                        } else {
                            if (old_active.index() < optionLength - 1) {
                                old_active.next().trigger("mouseover");
                            }
                        }
                    }
                    return false;
                });

            }();
        });

        /*点击他处，select消失*/
        // $(document).on("click", function () {
        //     $(".main-select").hide();
        //     return false;
        // });

    }
};

jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};



