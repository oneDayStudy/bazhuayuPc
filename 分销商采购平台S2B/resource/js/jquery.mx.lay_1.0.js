var MXNET_UI_LAY = {
    MsgType: { MsgTypeSuc: 1, MsgTypeWar: 0, MsgTypeErr: 8, MsgTypeHelp: 7 },
    Close: function (index) {
        layer.close(index);
    },
    RePosition: function () {
        if (layer.autoPos) { layer.autoPos(); }
    },
    Create: function (src, title, width, height, closeCallback) {
        var height = height > ($(window).height() - 16) ? ($(window).height() - 16) : height;
        var lay_top = ($(window).height() - height - 16) / 2;
        var lay_left = ($(window).width() - width - 16) / 2;
        if (typeof (closeCallback) == "function") {
            $.layer({
                type: 2, moveType: 1, closeBtn: [2, true],
                iframe: { src: src },
                fix: true,
                title: title,
                area: [width + "px", height + "px"], offset: [lay_top + "px", lay_left + "px"],
                close: closeCallback
            });
        }
        else {
            $.layer({
                type: 2, moveType: 1, closeBtn: [2, true],
                iframe: { src: src },
                fix: true,
                title: title,
                area: [width + "px", height + "px"], offset: [lay_top + "px", lay_left + "px"]
            });
        }
    },
    Confirm: function (sMsg, fCallback, fCallbackNo) {
        $.layer({
            type: 0, moveType: 1,
            title: "系统提示",
            closeBtn: [2, true],
            shade: [0.1, '#000', true],
            shadeClose: false,
            dialog: {
                btns: 2,
                type: 0,
                msg: sMsg,
                btn: ["确定", "取消"],
                yes: function (index) { layer.close(index); fCallback(); },
                no: function () {
                    if (fCallbackNo && typeof (fCallbackNo) == "function") {
                        fCallbackNo();
                    }
                }
            }
        });
    },
    Tips: function (sMsg, oFollow, align) {
        var al = 0;
        oFollow.focus();
        switch (align) {
            case "top":
                al = 0;
                break;
            case "right":
                al = 1;
                break;
            case "bottom":
                al = 3;
                break;
            case "left":
                al = 4;
                break;
            default:
                al = 0;
                break;
        }
        $.layer({
            type: 4, moveType: 1,
            shade: [0],
            shadeClose: true,
            bgcolor: "none",
            time: 3,
            tips: {
                msg: sMsg,
                follow: oFollow,
                guide: al,
                isGuide: true,
                style: ["background-color:#e74c3c; color:#FFF;", "#e74c3c"]
            }
        });
    },
    //msg:消息内容，msgType:消息类型（图标），duration:显示时长
    ShowMsg: function (msg, msgType, duration, callback) {
        var _d = typeof (duration) == "undefined" || duration == null ? 2 : duration;
        var _t = typeof (msgType) == "undefined" || msgType == null ? MXNET_UI_LAY.MsgType.MsgTypeSuc : msgType;
        $.layer({
            type: 0, moveType: 1,
            title: false,
            time: _d,
            closeBtn: [0, false],
            shade: [0.1, '#000', false],
            shadeClose: true,
            dialog: {
                btns: 0,
                type: _t,
                msg: msg
            },
            end: callback
        });
    },
    //右下角提示消息
    PopMessage: function (title, msg, msgType, isAutoClose) {
        if (typeof (msgType) == "undefined") { return; }
        if (typeof (isAutoClose) == "undefined") { isAutoClose = true; }
        toastr.options = {
            closeButton: true,
            debug: false,
            newestOnTop: false,
            progressBar: true,
            positionClass: "toast-bottom-right",
            preventDuplicates: false,
            onclick: null,
            showDuration: 300,
            hideDuration: 1000,
            timeOut: isAutoClose ? 5000 : 0,
            extendedTimeOut: isAutoClose ? 1000 : 0,
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        };
        switch (msgType) {
            case MXNET_UI_LAY.MsgType.MsgTypeSuc:
                toastr.success(msg, title);
                break;
            case MXNET_UI_LAY.MsgType.MsgTypeErr:
                toastr.error(msg, title);
                break;
            case MXNET_UI_LAY.MsgType.MsgTypeWar:
                toastr.warning(msg, title);
                break;
            case MXNET_UI_LAY.MsgType.MsgTypeHelp:
                toastr.info(msg, title);
                break;
            default:
                toastr.info(msg, title);
                break;
        };
    },
    //选择站点
    SelectSite: function (lineType, callback) {
        AjaxPost("{lineType:" + lineType + "}", "/DataService/PublicMethod.asmx/GetSupplierSite", function (d) {
            var html = [];
            html.push("<div class=\"form-section\" >");
            html.push("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"genForm\" style=\"width:630px;\">");
            html.push("<tr class=\"formRow\">");
            html.push("<td class=\"fedCtrl\">");
            html.push("<div class=\"chk-dl-group\" id=\"divSite\">");
            //html.push("<dl>");
            //html.push("<dt>");
            //html.push("<label for=\"chk_group_05ad376a-3b1d-4f24-8dcf-b2e665d52316\">");
            //html.push("<input type=\"checkbox\" value=\"05ad376a-3b1d-4f24-8dcf-b2e665d52316\" name=\"site\" id=\"chk_group_05ad376a-3b1d-4f24-8dcf-b2e665d52316\"><em>无锡</em></label></dt>");
            //html.push("<dd style=\"width: auto;\">");
            //html.push("<label for=\"chk_item_05ad376a-3b1d-4f24-8dcf-b2e665d52316_fc28cc69-4d83-488f-b1af-8974acfa8cc6\">");
            //html.push("<input type=\"checkbox\" group=\"05ad376a-3b1d-4f24-8dcf-b2e665d52316\" value=\"fc28cc69-4d83-488f-b1af-8974acfa8cc6\" id=\"chk_item_05ad376a-3b1d-4f24-8dcf-b2e665d52316_fc28cc69-4d83-488f-b1af-8974acfa8cc6\"><em>无锡</em></label></dd>");
            //html.push("</dl>");
            //html.push("<dl>");
            //html.push("<dt>");
            //html.push("<label for=\"chk_group_b6ddc8fb-851e-46e4-acac-063880052932\">");
            //html.push("<input type=\"checkbox\" value=\"b6ddc8fb-851e-46e4-acac-063880052932\" name=\"site\" id=\"chk_group_b6ddc8fb-851e-46e4-acac-063880052932\"><em>安徽</em></label></dt>");
            //html.push("<dd style=\"width: auto;\">");
            //html.push("<label for=\"chk_item_b6ddc8fb-851e-46e4-acac-063880052932_25bd83c8-062d-411d-bcd4-eec5b457c6ff\">");
            //html.push("<input type=\"checkbox\" group=\"b6ddc8fb-851e-46e4-acac-063880052932\" value=\"25bd83c8-062d-411d-bcd4-eec5b457c6ff\" id=\"chk_item_b6ddc8fb-851e-46e4-acac-063880052932_25bd83c8-062d-411d-bcd4-eec5b457c6ff\"><em>合肥</em>");
            //html.push("</label>");
            //html.push("<label for=\"chk_item_b6ddc8fb-851e-46e4-acac-063880052932_4251c136-4edf-42d0-bd31-e58e21f0e998\">");
            //html.push("<input type=\"checkbox\" group=\"b6ddc8fb-851e-46e4-acac-063880052932\" value=\"4251c136-4edf-42d0-bd31-e58e21f0e998\" id=\"chk_item_b6ddc8fb-851e-46e4-acac-063880052932_4251c136-4edf-42d0-bd31-e58e21f0e998\"><em>淮南</em>");
            //html.push("</label>");
            //html.push("<label for=\"chk_item_b6ddc8fb-851e-46e4-acac-063880052932_125a9092-d493-40e5-a065-b8250bad8aa7\">");
            //html.push("<input type=\"checkbox\" group=\"b6ddc8fb-851e-46e4-acac-063880052932\" value=\"125a9092-d493-40e5-a065-b8250bad8aa7\" id=\"chk_item_b6ddc8fb-851e-46e4-acac-063880052932_125a9092-d493-40e5-a065-b8250bad8aa7\"><em>六安</em>");
            //html.push("</label>");
            //html.push("</dd>");
            //html.push("</dl>");
            //html.push("<dl>");
            //html.push("<dt>");
            //html.push("<label for=\"chk_group_c6eaa172-883a-4729-b548-8f7c22d672da\">");
            //html.push("<input type=\"checkbox\" value=\"c6eaa172-883a-4729-b548-8f7c22d672da\" name=\"site\" id=\"chk_group_c6eaa172-883a-4729-b548-8f7c22d672da\"><em>苏州</em></label></dt>");
            //html.push("<dd style=\"width: auto;\">");
            //html.push("<label for=\"chk_item_c6eaa172-883a-4729-b548-8f7c22d672da_c61882d5-45ec-4b50-b94d-67159e299c7f\">");
            //html.push("<input type=\"checkbox\" group=\"c6eaa172-883a-4729-b548-8f7c22d672da\" value=\"c61882d5-45ec-4b50-b94d-67159e299c7f\" id=\"chk_item_c6eaa172-883a-4729-b548-8f7c22d672da_c61882d5-45ec-4b50-b94d-67159e299c7f\"><em>相城</em>");
            //html.push("</label>");
            //html.push("<label for=\"chk_item_c6eaa172-883a-4729-b548-8f7c22d672da_966ad0d0-dc88-49f4-898d-bb427cff8c19\">");
            //html.push("<input type=\"checkbox\" group=\"c6eaa172-883a-4729-b548-8f7c22d672da\" value=\"966ad0d0-dc88-49f4-898d-bb427cff8c19\" id=\"chk_item_c6eaa172-883a-4729-b548-8f7c22d672da_966ad0d0-dc88-49f4-898d-bb427cff8c19\"><em>苏州</em>");
            //html.push("</label>");
            //html.push("</dd>");
            //html.push("</dl>");
            html.push(d.d);
            html.push("</div>");
            html.push("</td>");
            html.push("</tr>");
            html.push("<tr class=\"formButtonRow\">");
            html.push("<td>");
            html.push("<a href=\"javascript:;\" id=\"btnOK\" class=\"button\">确定</a>&nbsp;");
            html.push("<a href=\"javascript:;\" id=\"btnClose\" class=\"cancelButton\">关闭</a>");
            html.push("</td>");
            html.push("</tr>");
            html.push("</table>");
            html.push("</div>");

            var index = $.layer({
                type: 1,
                title: "选择站点",
                closeBtn: [2, true],
                border: [5, 0.5, '#666', true],
                moveType: 1,
                area: ['650px', 'auto'],
                page: {
                    html: html.join('')
                },
                success: function () {
                    if (lineType > 1) {
                        $("#divSite").find("dl dt input:checkbox").bind("click", function () {
                            if (this.checked) {
                                $(this).parents("dl").find("dd input:checkbox").each(function () {
                                    this.checked = true;
                                    $(this).parent().addClass("se");
                                });
                                $(this).parents("dl").addClass("checked");
                                $(this).parents("dl dt label").addClass("se");
                            }
                            else {
                                $(this).parents("dl").find("dd input:checkbox").removeAttr("checked");
                                $(this).parents("dl").find("label").removeClass("se");
                                $(this).parents("dl").removeClass("checked");
                            }
                            if ($("#divSite").find("dd input:checkbox:checked").length == 1) {
                                $("#divSite").find("dd input:checkbox:checked")[0].disabled = true;
                            } else {
                                $("#divSite").find("dd input:checkbox").removeAttr("disabled");
                            }
                        });
                        $("#divSite").find("dl dd input:checkbox").bind("click", function () {
                            if (this.checked) {
                                $(this).parent().addClass("se");
                            }
                            else {
                                $(this).parent().removeClass("se");
                            }
                            if ($(this).parents("dd").find("input:checkbox:checked").length > 0) {
                                $(this).parents("dl").find("dt input:checkbox")[0].checked = true;
                                $(this).parents("dl").addClass("checked");
                                $(this).parents("dl").find("dt label").addClass("se");
                            } else {
                                $(this).parents("dl").find("dt input:checkbox").removeAttr("checked");
                                $(this).parents("dl").removeClass("checked");
                                $(this).parents("dl").find("dt label").removeClass("se");
                            }
                            if ($("#divSite").find("dd input:checkbox:checked").length == 1) {
                                $("#divSite").find("dd input:checkbox:checked")[0].disabled = true;
                            } else {
                                $("#divSite").find("dd input:checkbox").removeAttr("disabled");
                            }
                        });
                    }
                    else {
                        $("#divSite").find("input:radio[name='site']").bind("click", function () {
                            //debugger;
                            $(this).parents("dl").addClass("checked").siblings().removeClass("checked");
                            $(this).parent().addClass("se").parents("dl").siblings().find("label").removeClass("se");
                            $(this).parents("dl").find("input:checkbox").each(function () {
                                this.checked = true;
                                $(this).parent().addClass("se");
                            });
                            $(this).parents("dl").find("input:checkbox").removeAttr("disabled");
                            $(this).parents("dl").siblings().find("input:checkbox").each(function () {
                                this.checked = false;
                                $(this).attr("disabled", "disabled");
                            });
                            $(this).parents("dl").siblings().find("input:checkbox").removeAttr("checked");
                            if ($("#divSite").find("dd input:checkbox:checked").length == 1) {
                                $("#divSite").find("dd input:checkbox:checked")[0].disabled = true;
                            } else {
                                $("#divSite").find("dd input:checkbox").removeAttr("disabled");
                            }
                            //if ($(this).val().length > 0) {
                            //    var dataDeq = {
                            //        siteGuid: $(this).val(),
                            //        siteName: $(this).attr("siteName")
                            //    };
                            //    AjaxPost($.toJSON(dataDeq), "/DataService/ShortLine.asmx/SearchDestinationData", function (d) {
                            //        _self.FormFiled.Destination.html(d.d);
                            //        _self.InitDes();
                            //    });
                            //} else {
                            //    _self.FormFiled.Destination.html("");
                            //}
                        });
                        $("#divSite").find("input:checkbox").bind("click", function () {
                            if (this.checked) {
                                $(this).parent().addClass("se");
                            }
                            else {
                                $(this).parent().removeClass("se");
                            }
                            if ($(this).parents("dd").find("input:checkbox:checked").length == 1) {
                                $(this).parents("dd").find("input:checkbox:checked")[0].disabled = true;
                            } else {
                                $(this).parents("dd").find("input:checkbox").removeAttr("disabled");
                            }
                            if ($(this).parents("dd").find("input:checkbox:checked").length > 0) {
                                $(this).parents("dl").find("dt input:radio")[0].checked = true;
                                $(this).parents("dl").find("dt label").addClass("se");
                                $(this).parents("dl").siblings().find("input:checkbox").each(function () {
                                    $(this).attr("checked", false);
                                    $(this).attr("disabled", "disabled")
                                });
                            }
                        });
                    }

                    $("#btnOK").bind("click", function () {
                        if ($("#divSite").find("dl dd input:checked").length <= 0) {
                            MXNET_UI_LAY.Tips("请选择站点！", $("#divSite"));
                            return;
                        }
                        var item = [];
                        $("#divSite").find("dl dt input:checked").each(function () {
                            var ParentGuid = $(this).val();
                            item.push({
                                ParentGuid: "00000000-0000-0000-0000-000000000000",
                                Guid: ParentGuid,
                                Name: $(this).next().html()
                            });
                            $(this).parents("dl").find("dd input:checked").each(function () {
                                item.push({
                                    ParentGuid: ParentGuid,
                                    Guid: $(this).val(),
                                    Name: $(this).next().html()
                                });
                            });
                        });
                        if (callback) callback(item);
                        layer.close(index);
                    });

                    $("#btnClose").bind("click", function () {
                        layer.close(index);
                    });
                }
            });
        });
    },
    SelectDestination: function (lineType, supplierGuid, callback, iheight) {
        var height = (iheight == null ? 510 : iheight);
        AjaxPost("{lineType:" + lineType + ",supplierGuid:'" + supplierGuid + "'}", "/DataService/PublicMethod.asmx/GetSupplierDestination", function (d) {
            var html = [];
            html.push("<div class=\"form-section\">");
            html.push("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"genForm\" style=\"width:630px;\">");
            html.push("<tr class=\"formRow\">");
            html.push("<td class=\"fedCtrl\">");
            html.push("<div class=\"chk-grp-destination\" id=\"divDestination\" style=\"overflow-y:auto;height:" + height + "px;\">");

            html.push(d.d);
            html.push("</div>");
            html.push("</td>");
            html.push("</tr>");
            html.push("<tr class=\"formButtonRow\">");
            html.push("<td>");
            html.push("<a href=\"javascript:;\" id=\"btnOK\" class=\"button\">确定</a>&nbsp;");
            html.push("<a href=\"javascript:;\" id=\"btnClose\" class=\"cancelButton\">关闭</a>");
            html.push("</td>");
            html.push("</tr>");
            html.push("</table>");
            html.push("</div>");

            var index = $.layer({
                type: 1,
                title: "选择目的地",
                closeBtn: [2, true],
                border: [5, 0.5, '#666', true],
                moveType: 1,
                area: ['650px', 'auto'],
                page: {
                    html: html.join('')
                },
                success: function () {
                    $("#divDestination").find("dl dt input:checkbox").bind("click", function () {
                        if (this.checked) {
                            $(this).parents("dl").find("dd input:checkbox").each(function () {
                                this.checked = true;
                                $(this).parent().addClass("se");
                            });
                            $(this).parents("dl").addClass("checked");
                            $(this).parents("dl dt label").addClass("se");
                        }
                        else {
                            $(this).parents("dl").find("dd input:checkbox").removeAttr("checked");
                            $(this).parents("dl").find("label").removeClass("se");
                            $(this).parents("dl").removeClass("checked");
                        }
                        if ($("#divDestination").find("dd input:checkbox:checked").length == 1) {
                            $("#divDestination").find("dd input:checkbox:checked")[0].disabled = true;
                        } else {
                            $("#divDestination").find("dd input:checkbox").removeAttr("disabled");
                        }
                    });
                    $("#divDestination").find("dl dd input:checkbox").bind("click", function () {
                        if (this.checked) {
                            $(this).parent().addClass("se");
                        }
                        else {
                            $(this).parent().removeClass("se");
                        }
                        if ($(this).parents("dd").find("input:checkbox:checked").length > 0) {
                            $(this).parents("dl").find("dt input:checkbox")[0].checked = true;
                            $(this).parents("dl").addClass("checked");
                            $(this).parents("dl").find("dt label").addClass("se");
                        } else {
                            $(this).parents("dl").find("dt input:checkbox").removeAttr("checked");
                            $(this).parents("dl").removeClass("checked");
                            $(this).parents("dl").find("dt label").removeClass("se");
                        }
                        if ($("#divDestination").find("dd input:checkbox:checked").length == 1) {
                            $("#divDestination").find("dd  input:checkbox:checked")[0].disabled = true;
                        } else {
                            $("#divDestination").find("dd input:checkbox").removeAttr("disabled");
                        }
                    });

                    $("#btnOK").bind("click", function () {
                        if ($("#divDestination").find("dl dd input:checked").length <= 0) {
                            MXNET_UI_LAY.Tips("请选择目的地！", $("#divDestination"));
                            return;
                        }

                        var item = [];
                        $("#divDestination").find("dl dt input:checked").each(function () {
                            var ParentGuid = $(this).val();
                            item.push({
                                ParentGuid: "00000000-0000-0000-0000-000000000000",
                                Guid: ParentGuid,
                                Name: $(this).next().html()
                            });
                            $(this).parents("dl").find("dd input:checked").each(function () {
                                item.push({
                                    ParentGuid: ParentGuid,
                                    Guid: $(this).val(),
                                    Name: $(this).next().html()
                                });
                            });
                        });
                        if (callback) callback(item);
                        layer.close(index);
                    });
                    $("#btnClose").bind("click", function () {
                        layer.close(index);
                    });
                }
            });
        });
    },
    SelectImg: function (callback) {
        var html = [];
        html.push("<div class=\"form-section\">");
        html.push("<div forid=\"divGallery\" class=\"tabcot tour-dates\">");
        html.push("<div class=\"imgSearchBar\">");
        html.push("<div class=\"schRow\">");
        html.push("<div class=\"schCtrlTxt\">区域</div>");
        html.push("<div class=\"schCtrl\">");
        html.push("<select id=\"drpRegional\" class=\"dropDownList\">");
        SynchAjaxPost("{}", "/DataService/Line.asmx/RegionalData", function (d) {
            html.push(d.d);
        });
        html.push("</select>");
        html.push("<select id=\"drpProvince\" class=\"dropDownList\">");
        html.push("<option value=\"\">--全部--</option>");
        html.push("</select>");
        html.push("<select id=\"drpCity\" class=\"dropDownList\">");
        html.push("<option value=\"\">--全部--</option>");
        html.push("</select>");
        html.push("</div>");
        html.push("<div class=\"schCtrlTxt\">景点名称</div>");
        html.push("<div class=\"schCtrl\">");
        html.push("<input type=\"text\" class=\"textBox\"  id=\"txtAttractionName\"/>");
        html.push("</div>");
        html.push("<div class=\"schBtn\">");
        html.push("<a href=\"javascript:;\" class=\"button\" id=\"btnSearch\">查询</a>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("<div class=\"imglistbox\" id=\"divImgList\" style=\"overflow-y:scroll;height:450px;width:750px;\">");
        //html.push("<a class=\"item\" href=\"javascript:;\">");
        //html.push("<div class=\"titbox\">黑龙潭公园</div>");
        //html.push("<div class=\"titboxbg\"></div>");
        //html.push("<div class=\"seicon\"></div>");
        //html.push("<img src=\"http://img1.qunarzz.com/travel/poi/201403/28/ccea80a1c23fde80ddb12cfb.jpg\" alt=\"黑龙潭公园\" class=\"img\" /></a>");
        //html.push("<a class=\"item\" href=\"javascript:;\">");
        //html.push("<div class=\"titbox\">黑龙潭公园</div>");
        //html.push("<div class=\"titboxbg\"></div>");
        //html.push("<div class=\"seicon\"></div>");
        //html.push("<img src=\"http://img1.qunarzz.com/travel/poi/201403/28/ccea80a1c23fde80ddb12cfb.jpg\" alt=\"黑龙潭公园\" class=\"img\"/></a>");
        //html.push("<a class=\"item\" href=\"javascript:;\">");
        //html.push("<div class=\"titbox\">丽江古城</div>");
        //html.push("<div class=\"titboxbg\"></div>");
        //html.push("<div class=\"seicon\"></div>");
        //html.push("<img src=\"http://img1.qunarzz.com/travel/poi/201403/28/acfadba33c2cc33dddb12cfb.jpg\" alt=\"丽江古城\" class=\"img\"/></a>");
        html.push("</div>");
        html.push("</div>");
        html.push("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"genForm\">");
        html.push("<tr class=\"formButtonRow\">");
        html.push("<td>");
        html.push("<a href=\"javascript:;\" id=\"btnOK\" class=\"button\">确定</a> ");
        html.push("<a href=\"javascript:;\" id=\"btnClose\" class=\"cancelButton\">关闭</a>");
        html.push("</td>");
        html.push("</tr>");
        html.push("</table>");
        html.push("</div>");
        var index = $.layer({
            type: 1,
            title: "选择景点图片",
            closeBtn: [2, true],
            border: [5, 0.5, '#666', true],
            moveType: 1,
            area: ['790px', '600px'],
            page: {
                html: html.join('')
            },
            success: function () {
                $("#drpRegional").bind("change", function () {
                    $("#drpCity").html("<option value=\"\">--全部--</option>");
                    var val = $(this).find("option:selected").val();
                    if (val.length > 0) {
                        AjaxPost("{parentGuid:'00000000-0000-0000-0000-000000000000',regionType:'" + val + "',first:'--全部--'}", "/DataService/PublicMethod.asmx/SearchDrpData", function (d) {
                            $("#drpProvince").html(d.d);
                        });
                    }
                    else {
                        $("#drpProvince").html("<option value=\"\">--全部--</option>");
                    }
                });
                $("#drpProvince").bind("change", function () {
                    $("#drpCity").html("<option value=\"\">--全部--</option>");
                    var val = $(this).find("option:selected").val();
                    var val2 = $("#drpRegional").find("option:selected").val();
                    if (val.length > 0) {
                        AjaxPost("{parentGuid:'" + val + "',regionType:'" + val2 + "',first:'--全部--'}", "/DataService/PublicMethod.asmx/SearchDrpData", function (d) {
                            $("#drpCity").html(d.d);
                        });
                    }
                });

                $("#btnSearch").bind("click", function () {
                    //debugger;
                    if (($("#drpProvince").find("option:selected").val().length <= 0 && $("#drpCity").find("option:selected").val().length <= 0) && $("#txtAttractionName").val().length <= 0) {
                        MXNET_UI_LAY.ShowMsg("请选择区域或者输入景点名称进行查询！", MXNET_UI_LAY.MsgType.MsgTypeWar, 3);
                        return;
                    }
                    var search = {
                        RegionGuid: $("#drpProvince").find("option:selected").val(),
                        SubRegionGuid: $("#drpCity").find("option:selected").val(),
                        Name: $("#txtAttractionName").val()
                    };

                    AjaxPost($.toJSON({ parameter: search }), "/DataService/Line.asmx/SearchImgData", function (d) {
                        $("#divImgList").html(d.d);
                        $("#divImgList").find("a").bind("click", function () {
                            if ($(this).attr("class") == "item se") {
                                $(this).removeClass("se");
                            }
                            else {
                                $(this).addClass("se");
                            }
                        });
                    });
                });

                $("#btnOK").bind("click", function () {

                    var length = $("#divImgList a.item.se").length;
                    if (length <= 0) {
                        MXNET_UI_LAY.ShowMsg("请选择图片！", MXNET_UI_LAY.MsgType.MsgTypeWar, 3);
                        return;
                    }
                    var item = [];
                    $("#divImgList a.item.se").each(function () {
                        item.push({
                            Guid: $(this).attr("guid"),
                            Name: $(this).attr("name"),
                            ImgMin: $(this).attr("imgmin"),
                            ImgMidd: $(this).attr("imgmidd"),
                            ImgMax: $(this).attr("imgmax"),
                            ImgDefault: $(this).attr("imgdefault")
                        });
                    });
                    if (callback) callback(item);
                    layer.close(index);
                });
                $("#btnClose").bind("click", function () {
                    layer.close(index);
                });
            }
        });


    },
    SelectPickSite: function (guid, customize, pickType, url, departureDates, returnDates, lineType, shortLinePickSiteMustSame, platformType, stopBusType, bdt, zcjs, manCount, callback, callback1) {
        var html = [];
        var departureDate = new Date(departureDates);
        var returnDate = new Date(returnDates);
        html.push("<div class=\"form-section\">");

        if ((bdt == "1" && (lineType == 2 || lineType == 3)) || (zcjs == "true" && (lineType == 2 || lineType == 3))) {
            html.push("<div id=\"divRadPick\" style=\"margin-bottom:10px;\">");
            html.push("<span style=\"font-size:14px;margin-right:10px;font-weight: bold;\">请选择接送方式 :</span>");
            //add by guowei-20160414-添加接送停用设置stopBusType:默认为0；1班车不可用；2专车不可用
            if (stopBusType == 0 || stopBusType != 1) {
                html.push("<input type=\"radio\"  name=\"pickType\" value=\"1\" checked=\"checked\"/>班车接送 &nbsp;&nbsp;&nbsp;&nbsp;");
            }
            if (bdt == "1") {
                html.push("<input type=\"radio\"  name=\"pickType\" value=\"2\"/> 上门接送 &nbsp;&nbsp;&nbsp;&nbsp;");
            }
            if (zcjs == "true") {
                if (stopBusType == 0 || stopBusType != 2) {
                    html.push("<input type=\"radio\"  name=\"pickType\" value=\"4\"/> 专车上门接送");
                }
            }
            html.push("</div>");
        }

        html.push("<div style=\"border-top: 1px solid #DDDDDD;\">");
        html.push("<div class=\"jt_icon_cls\"></div>");
        html.push("<div class=\"SiteAdd\">");
        html.push("<div class=\"Bzy_Box\" id=\"station_cls\">");

        html.push("<div style=\"width: 950px;\" class=\"box_info\">");
        html.push("<div class=\"box_next\">");
        html.push("<div id='divContent2' class=\"bb_content\">");

        if (pickType == "4" && (lineType == 2 || lineType == 3)) {
            html.push("<div id='divContent3'>");
        }
        else {
            html.push("<div id='divContent3' style=\"display:none;\">");
        }
        html.push("<iframe  frameborder=\"0\" src=\"/SpecialTrain.aspx?lineType=" + lineType + "&groupGuid=" + guid + "\" style=\"width: 100%; height: 500px;\" id=\"ifrSpecialTrain\" name=\"ifrSpecialTrain\"></iframe>");
        html.push("</div>");

        if (pickType == "2" && (lineType == 2 || lineType == 3)) {
            html.push("<div id='divContent1'>");
        } else {
            html.push("<div id='divContent1' style=\"display:none;\">");
        }
        if (pickType == "2" && (lineType == 2 || lineType == 3)) {
            html.push("<iframe  frameborder=\"0\" src=\"" + url + "\" style=\"width: 100%; height: 500px;\" id=\"ifrbaidu\"></iframe>");
        }
        else {
            html.push("<iframe  frameborder=\"0\" style=\"width: 100%; height: 500px;\" id=\"ifrbaidu\"></iframe>");
        }
        html.push("</div>");
        if (pickType == "1")
            html.push("<div class=\"go_to_site go_site_cls\" style=\"height: 500px;\">");
        else
            html.push("<div class=\"go_to_site go_site_cls\" style=\"display:none;\" >");

        html.push("<div class=\"site_box_select site_box_go\" >");
        html.push("<div class=\"start_site\" style=\"color:#c0392b\">去程站点选择：</div>");
        html.push("<div class=\"station_data station_data_scroll\" id=\"divGo\"  style=\"height: 450px;\">");
        AjaxPost("{groupGuid:'" + guid + "'}", "/DataService/LineBooking.asmx/GoSite", function (d) {
            html.push(d.d);
        }, null, false);
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        if (pickType == "1")
            html.push("<div class=\"go_to_site\" style=\"height: 500px;\">");
        else
            html.push("<div class=\"go_to_site\" style=\"display:none;\">");
        html.push("<div class=\"site_box_select site_box_back\" >");
        html.push("<div class=\"start_site\" style=\"color:#c0392b\">回程站点选择：</div>");
        html.push("<div class=\"station_data station_data_scroll\" id=\"divReturn\" style=\"height: 450px;\">");
        AjaxPost("{groupGuid:'" + guid + "'}", "/DataService/LineBooking.asmx/ReturnSite", function (d) {
            html.push(d.d);
        }, null, false);
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("<div class=\"site_but\">");
        html.push("<div class=\"site_v\">");
        html.push("<label>");
        if (platformType == 3)//等于中和时不可选择
        {
            html.push("<input type=\"checkbox\" id=\"chkAllTourist\" checked=\"checked\" disabled=\"disabled\" class=\"bc\" name=\"bc_select\">&nbsp;<b style=\"color:#c0392b;vertical-align:middle; \" >应用到所有游客</b></label>");
        }
        else {
            html.push("<input type=\"checkbox\" id=\"chkAllTourist\" checked=\"checked\" class=\"bc\" name=\"bc_select\">&nbsp;<b style=\"color:#c0392b;vertical-align:middle; \" >应用到所有游客</b></label>");
        }
        html.push("<input type=\"button\" id=\"btnOK\" value=\"确认选择\" class=\"bt\" name=\"bt_select\">");
        html.push("<input type=\"button\" id=\"btnCancel\" value=\"取消选择\" class=\"bt\" name=\"bt_select\">");
        //if (customize !== "")
        //    if (lineType == 3 || lineType == 2) {
        //        html.push("<input type=\"button\" id=\"btnCustomize\" value=\"自定义上车点\" class=\"bt\" name=\"bt_select\" >");
        //    }
        html.push("</div>");
        html.push("<div class=\"site_content\">");
        html.push("<div class=\"site_go\">");
        html.push("<span class=\"title\">当前去程选中:</span>");
        html.push("<span class=\"sc_info\" id=\"spanGoSelectInfo\"></span>");
        html.push("</div>");
        html.push("<div class=\"site_back\">");
        html.push("<span class=\"title\">当前返程选中:</span>");
        html.push("<span class=\"sc_info\" id=\"spanReturnSelectInfo\"></span>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("<div class=\"back_cls\"></div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        var index = $.layer({
            type: 1,
            title: "选择上车点",
            closeBtn: [2, true],
            border: [5, 0.5, '#666', true],
            moveType: 1,
            area: ['980px', '680px'],
            page: {
                html: html.join('')
            },
            success: function () {
                if (lineType == 2 || lineType == 3) {
                    var str = [];
                    str.push("<div class=\"station_cls\">");
                    str.push("<div guid=\"\" class=\"sc_title\">自行前往 </div>");
                    str.push("<div class=\"sc_info\">");
                    str.push("<div class=\"sl_div\">");
                    str.push("<div class=\"sl_info\">");
                    str.push("<ul>");
                    str.push("<li uname=\"旅客自行前往火车站/机场集合\" rebateprice=\"0.00\" salesprice=\"00.00\" picksitedetailguid=\"\" systype=\"9\" datetime=\"\" class=\"site_list\">旅客自行前往火车站/机场集合</li>");
                    str.push("</ul>");
                    str.push("</div>")
                    str.push("</div>");
                    str.push("</div>");
                    str.push("</div>");
                    $("#divGo").prepend(str.join(''));

                    var strReturn = '';
                    strReturn += '<div class="station_cls">';
                    strReturn += '<div class="sc_title" guid="">自行返回</div>';
                    strReturn += '<div class="sc_info">';
                    strReturn += '<div class="sl_div">';
                    strReturn += '<div class="sl_info">';
                    strReturn += '<ul>';
                    strReturn += '<li class="site_list" datetime="" systype="9"  salesprice="0.00" rebateprice="0.00" uname="旅客自行由火车站/机场返回">旅客自行由火车站/机场返回</li>';
                    strReturn += '</ul>';
                    strReturn += '</div>';
                    strReturn += '</div>';
                    strReturn += '</div>';
                    strReturn += '</div>';
                    $("#divReturn").prepend(strReturn);
                }

                //debugger;
                $("#divGo li").bind("click", function () {
                    $("#divGo li").removeClass("site_list_click");
                    $(this).addClass("site_list_click");
                    $("#spanGoSelectInfo").html($("#divGo li.site_list_click").attr("datetime") + " " + $("#divGo li.site_list_click").attr("uname") + " ￥" + $("#divGo li.site_list_click").attr("salesprice"));
                    if (lineType == 1 && shortLinePickSiteMustSame.toLowerCase() == "true") {
                        $("#divReturn li").removeClass("site_list_click");
                        $("#spanReturnSelectInfo").html("");
                        if ($(this).attr("systype") == "1") {
                            var guid = $(this).parents("div.station_cls").find(".sc_title").attr("guid");
                            if ($("#divReturn .sc_title[guid='" + guid + "']").length > 0) {
                                $("#divReturn .sc_title[guid='" + guid + "']").parents("div.station_cls").find("li:first").addClass("site_list_click");
                                $("#spanReturnSelectInfo").html($("#divReturn li.site_list_click").attr("datetime") + " " + $("#divReturn li.site_list_click").attr("uname") + " ￥" + $("#divReturn li.site_list_click").attr("salesprice"));
                            }
                        }
                        else {
                            //debugger;
                            var name = $(this).attr("uname");
                            if ($("#divReturn li[uname='" + name + "']").length > 0) {
                                $("#divReturn li[uname='" + name + "']:first").addClass("site_list_click");
                                $("#spanReturnSelectInfo").html($("#divReturn li.site_list_click").attr("datetime") + " " + $("#divReturn li.site_list_click").attr("uname") + " ￥" + $("#divReturn li.site_list_click").attr("salesprice"));
                            }
                        }
                    }
                });
                $("#divReturn li").bind("click", function () {
                    $("#divReturn li").removeClass("site_list_click");
                    $(this).addClass("site_list_click");
                    $("#spanReturnSelectInfo").html($("#divReturn li.site_list_click").attr("datetime") + " " + $("#divReturn li.site_list_click").attr("uname") + " ￥" + $("#divReturn li.site_list_click").attr("salesprice"));
                });
                if (lineType == 1 && shortLinePickSiteMustSame.toLowerCase() == "true") {
                    $("#divReturn li").unbind("click");
                    $("#divReturn li").removeClass("site_list_click");
                }
                $("#divRadPick input:radio").bind("click", function () {

                    $("#spanGoSelectInfo").html("");
                    $("#spanReturnSelectInfo").html("");
                    $("#chkAllTourist").parent().show();
                    if (this.value == "2") {//上门接送
                        $(".go_to_site").hide();
                        $("#divContent1").show();
                        $("#divContent3").hide();
                        $("#ifrbaidu").attr("src", url);
                    } else if (this.value == "1") {//班车接送
                        $(".go_to_site").show();
                        $("#divContent1").hide();
                        $("#divContent3").hide();
                    }
                    else if (this.value == "4") {//专车接送
                        $(".go_to_site").hide();
                        $("#divContent1").hide();
                        $("#divContent3").show();
                        //$("#chkAllTourist").parent().hide();
                    }
                    //PageUI.FormFiled.PickType.val(this.value);
                });

                if ($("#divRadPick input:radio").length > 0) {
                    $("#divRadPick input:radio:eq(0)").trigger("click");
                }
                $("#btnOK").bind("click", function () {
                    var currentPickType;
                    if ($("#divRadPick").length > 0) {
                        currentPickType = $("#divRadPick input:radio:checked").val();
                    } else {
                        currentPickType = pickType;
                    }
                    if (zcjs == "true" && currentPickType == "4")//无锡专车接送
                    {
                        var _self = window.frames["ifrSpecialTrain"].PageUI;
                        if ($("#spanGoSelectInfo").html().length <= 0) {
                            MXNET_UI_LAY.ShowMsg("请选择去程上车点", MXNET_UI_LAY.MsgType.MsgTypeWar, 3);
                            return;
                        }

                        if ($("#spanGoSelectInfo").attr("isselfroundtrip") == "false") {
                            if (_self.FormFiled.GProduct.find("option:selected").val().length <= 0) {
                                MXNET_UI_LAY.ShowMsg("请选择去程专车产品", MXNET_UI_LAY.MsgType.MsgTypeWar, 3);
                                //MXNET_UI_LAY.Tips("请选择去程专车产品", _self.FormFiled.GProduct);
                                _self.FormFiled.GProduct.focus();
                                return;
                            }
                        }
                        if ($("#spanReturnSelectInfo").html().length <= 0) {
                            MXNET_UI_LAY.ShowMsg("请选择回程上车点", MXNET_UI_LAY.MsgType.MsgTypeWar, 3);
                            return;
                        }
                        if ($("#spanReturnSelectInfo").attr("isselfroundtrip") == "false") {
                            if (_self.FormFiled.RProduct.find("option:selected").val().length <= 0) {
                                MXNET_UI_LAY.ShowMsg("请选择回程专车产品", MXNET_UI_LAY.MsgType.MsgTypeWar, 3);
                                //MXNET_UI_LAY.Tips("请选择回程专车产品", _self.FormFiled.RProduct);
                                _self.FormFiled.RProduct.focus();
                                return;
                            }
                        }

                    } else {
                        if ($("#spanGoSelectInfo").html().length <= 0) {
                            MXNET_UI_LAY.ShowMsg("请选择去程上车点", MXNET_UI_LAY.MsgType.MsgTypeWar, 3);
                            return;
                        }
                        if (currentPickType == "1" && (lineType == 2 || lineType == 3)) {
                            if ($("#spanReturnSelectInfo").html().length <= 0) {
                                MXNET_UI_LAY.ShowMsg("请选择回程上车点", MXNET_UI_LAY.MsgType.MsgTypeWar, 3);
                                return;
                            }
                        }
                        else if (currentPickType == "1" && lineType == 1) {
                            if ($("#spanReturnSelectInfo").html().length <= 0 && $("#divReturn li").length > 0) {
                                var msg = "请选择回程上车点";
                                if (shortLinePickSiteMustSame.toLowerCase() == "true")//安微站
                                {
                                    msg = "回程上车点与去程上车点必须一致";
                                }
                                MXNET_UI_LAY.ShowMsg(msg, MXNET_UI_LAY.MsgType.MsgTypeWar, 3);
                                return;
                            }
                        }
                        else if (currentPickType == "0" || currentPickType == "2") {
                            if ($("#spanReturnSelectInfo").html().length <= 0) {
                                MXNET_UI_LAY.ShowMsg("请选择回程上车点", MXNET_UI_LAY.MsgType.MsgTypeWar, 3);
                                return;
                            }
                        }
                    }

                    var item = [];
                    if (zcjs == "true" && currentPickType == "4")//无锡专车接送
                    {
                        //debugger;
                        if (typeof ($("#spanGoSelectInfo").attr("guid")) != "undefined") {
                            item.push({
                                StationType: 1, //去程
                                PickSiteDetailGuid: $("#spanGoSelectInfo").attr("guid"),
                                SysType: 4,
                                DateTime: "",
                                SalesPrice: $("#spanGoSelectInfo").attr("saleprice"),
                                Rebateprice: $("#spanGoSelectInfo").attr("rebateprice"),
                                Name: $("#spanGoSelectInfo").attr("uname"),
                                Address: $("#spanGoSelectInfo").attr("address"),
                                XY: 0,
                                Distance: 0,
                                IsAllTourist: $("#chkAllTourist")[0].checked
                            });
                        }

                        if (typeof ($("#spanReturnSelectInfo").attr("guid")) != "undefined") {
                            item.push({
                                StationType: 2, //回程
                                PickSiteDetailGuid: $("#spanReturnSelectInfo").attr("guid"),
                                SysType: 4,
                                DateTime: "",
                                SalesPrice: $("#spanReturnSelectInfo").attr("saleprice"),
                                Rebateprice: $("#spanReturnSelectInfo").attr("rebateprice"),
                                Name: $("#spanReturnSelectInfo").attr("uname"),
                                Address: $("#spanReturnSelectInfo").attr("address"),
                                XY: 0,
                                Distance: 0,
                                IsAllTourist: $("#chkAllTourist")[0].checked
                            });
                        }
                    }
                    else {//八达通,班车接送
                        var dom1 = $("#divGo li.site_list_click");
                        if (dom1.length > 0) {
                            item.push({
                                StationType: 1, //去程
                                PickSiteDetailGuid: dom1.attr("picksitedetailguid"),
                                SysType: dom1.attr("systype"),
                                DateTime: dom1.attr("datetime"),
                                SalesPrice: dom1.attr("salesprice"),
                                Rebateprice: dom1.attr("rebateprice"),
                                Name: dom1.attr("uname"),
                                Address: "",
                                XY: dom1.attr("xy"),
                                Distance: dom1.attr("distance"),
                                IsAllTourist: $("#chkAllTourist")[0].checked
                            });
                        }
                        var dom2 = $("#divReturn li.site_list_click");
                        if (dom2.length > 0) {
                            item.push({
                                StationType: 2, //回程
                                PickSiteDetailGuid: dom2.attr("picksitedetailguid"),
                                SysType: dom2.attr("systype"),
                                DateTime: dom2.attr("datetime"),
                                SalesPrice: dom2.attr("salesprice"),
                                Rebateprice: dom2.attr("rebateprice"),
                                Name: dom2.attr("uname"),
                                Address: "",
                                XY: dom2.attr("xy"),
                                Distance: dom2.attr("distance"),
                                IsAllTourist: $("#chkAllTourist")[0].checked
                            });
                        }
                    }

                    PageUI.FormFiled.PickType.val(currentPickType);
                    if ((lineType == 2 || lineType == 3) && PageUI.FormFiled.PickType.val() == "1") {
                        MXNET_UI_LAY.ShowMsg("提醒：待航班信息确认后，须进入散客订单进行“预订班车“的操作", MXNET_UI_LAY.MsgType.MsgTypeWar, 5, function () {
                            if (callback) callback(item);
                            layer.close(index);
                        });
                    }
                    else {
                        if (callback) callback(item);
                        layer.close(index);
                    }
                });
                $("#btnCancel").bind("click", function () {
                    var item = [];
                    item.push({
                        IsAllTourist: $("#chkAllTourist")[0].checked
                    });
                    if (callback1) callback1(item);
                    layer.close(index);
                });
                $("#btnCustomize").bind("click", function () {
                    var guids = guid;
                    MXNET_UI_LAY.Create("CarCustomize.aspx?sn=" + Math.random() + "&operation=1&guid=" + guids, "自定义上车点", 980, 580);
                });
                //$("#btnClose").bind("click", function () {
                //    layer.close(index);
                //});
            }
        });


    },
    SelectInsurance: function (lineGuid, callback) {
        //选择保险产品
        //debugger;
        var html = [];
        html.push("<div class=\"form-section\">");
        html.push("<div class=\"InsuranceCls\">");
        html.push("<div class=\"jt_icon_cls\"></div>");
        html.push("<div class=\"InsuranceAdd\">");
        html.push("<div class=\"ia_info\">");
        html.push("<div class=\"ia_table\">");
        html.push("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">");
        html.push("<thead>");
        html.push("<tr>");
        html.push("<td style=\"width: 320px\">保险产品</td>");
        html.push("<td style=\"width: 180px\">份数</td>");
        html.push("<td style=\"width: 140px\">金额</td>");
        html.push("</tr>");
        html.push("</thead>");
        AjaxPost("{lineGuid:'" + lineGuid + "'}", "/DataService/LineBooking.asmx/Insurance", function (d) {
            html.push(d.d);
        }, null, false);
        html.push("</table>");
        html.push("</div>");
        html.push("<div class=\"ia_but\">");
        //html.push("<div class=\"ia_but_left\">当前选择中产品：<span class=\"Insurance_val\">长线豪华</span>");
        //html.push("</div>");
        html.push("<div class=\"ia_but_right\">");
        html.push("<label class=\"ia_all\">");
        html.push("<input type=\"checkbox\" id=\"chkAllTourist\"/> 应用到所有游客 </label>");
        html.push("<span class=\"not_buyer\" id=\"btnNot\">不买保险</span>");
        html.push("<span class=\"buyer_cls\" id=\"btnOK\">确定</span>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        var index = $.layer({
            type: 1,
            title: "选择保险产品",
            closeBtn: [2, true],
            border: [5, 0.5, '#666', true],
            moveType: 1,
            area: ['680px', '480px'],
            page: {
                html: html.join('')
            },
            success: function () {
                $("input:text[id^='txtInsurance_']").bind("blur", function () {
                    if (!formCheck.isNumber(this.value)) {
                        this.value = "0";
                    }
                });
                $("#btnOK").bind("click", function () {
                    var item = [];
                    //debugger;
                    $("input:text[id^='txtInsurance_']").each(function () {
                        if (parseInt(this.value) > 0) {
                            item.push({
                                InsuranceGuid: $(this).attr("guid"),
                                Name: $(this).attr("pname"),
                                Number: this.value,
                                Unitprice: $(this).attr("unitprice"),
                                SettlementPrice: $(this).attr("settlementprice"),
                                IsAllTourist: $("#chkAllTourist")[0].checked,
                                IsDoNotBuy: 1 //买
                            });
                        }
                    });
                    if (callback) callback(item);
                    layer.close(index);
                });
                $("#btnNot").bind("click", function () {
                    var item = [];
                    $("input:text[id^='txtInsurance_']").each(function () {
                        if (parseInt(this.value) > 0) {
                            item.push({
                                InsuranceGuid: $(this).attr("guid"),
                                Name: $(this).attr("pname"),
                                Number: this.value,
                                Unitprice: $(this).attr("unitprice"),
                                SettlementPrice: $(this).attr("settlementprice"),
                                IsAllTourist: $("#chkAllTourist")[0].checked,
                                IsDoNotBuy: 2 //不买
                            });
                        }
                    });
                    if (callback) callback(item);
                    layer.close(index);
                });
            }
        });
    },
    SelectInsuranceInfo: function (lineGuid, callback) {
        //选择保险产品
        //debugger;
        var html = [];
        html.push("<div class=\"form-section\" style=\"height: 410px; padding: 0; overflow-y: scroll; border: solid 1px #E8E8E8; padding: 0 5px;\" > ");
        html.push("<div class=\"InsuranceCls\">");
        html.push("<div class=\"jt_icon_cls\"></div>");
        html.push("<div class=\"InsuranceAdd\">");
        html.push("<div class=\"ia_info\">");
        html.push("<div class=\"ia_table\">");
        html.push("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">");
        html.push("<thead>");
        html.push("<tr>");
        html.push("<td style=\"width: 80px\">操作</td>");
        html.push("<td style=\"width: 360px\">保险产品</td>");
        //html.push("<td style=\"width: 180px\">份数</td>");
        html.push("<td style=\"width: 180px\">金额</td>");
        html.push("</tr>");
        html.push("</thead>");
        html.push("<tbody id=\"tbodyInsurance\" >");
        AjaxPost("{lineGuid:'" + lineGuid + "'}", "/DataService/LineBooking.asmx/InsuranceList", function (d) {
            html.push(d.d);
        }, null, false);
        html.push("</tbody>");
        html.push("</table>");
        html.push("</div>");
        html.push("<div class=\"ia_but\">");
        //html.push("<div class=\"ia_but_left\">当前选择中产品：<span class=\"Insurance_val\">长线豪华</span>");
        //html.push("</div>");
        //html.push("<div class=\"ia_but_right\">");
        //html.push("<label class=\"ia_all\">");
        //html.push("<input type=\"checkbox\" id=\"chkAllTourist\"/> 应用到所有游客 </label>");
        //html.push("<span class=\"not_buyer\" id=\"btnNot\">不买保险</span>");
        //html.push("<span class=\"buyer_cls\" id=\"btnOK\">确定</span>");
        //html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        var index = $.layer({
            type: 1,
            title: "选择保险产品",
            closeBtn: [2, true],
            border: [5, 0.5, '#666', true],
            moveType: 1,
            area: ['680px', '480px'],
            page: {
                html: html.join('')
            },
            success: function () {
                $("#tbodyInsurance a").each(function () {
                    $(this).click(function () {
                        //debugger;
                        //alert($("#tr_" + $(this).attr("guid")));
                        //alert($("#" + $(this).attr("guid")).html());

                        var item = [];
                        item.push({
                            InsuranceGuid: $(this).attr("guid"),
                            Name: $("#td_" + $(this).attr("guid") + "_name").html(),
                            Price: $("#td_" + $(this).attr("guid") + "_price").html()
                        });

                        if (callback) callback(item);
                        layer.close(index);
                    });
                });
            }
        });
    },
    //线路订单预定
    SelectSeasonTicketProduct: function (lineType, productbuy, lineSupplierGuid, IsFromOrder, callback) {
        //选择套票产品
        //debugger;
        var html = [];
        html.push("<div class=\"form-section\" style=\"height: 410px; padding: 0; overflow-y: scroll; border: solid 1px #E8E8E8; padding: 0 5px;\">");
        html.push("<div class=\"InsuranceCls\">");
        html.push("<div class=\"jt_icon_cls\"></div>");
        //html.push("<div class=\"InsuranceAdd\">");
        html.push("<div class=\"ia_info\">");
        html.push("<input type=\"checkbox\" id=\"chkAllTourist\" checked=\"checked\" class=\"bc\" name=\"bc_select\">&nbsp;<b style=\"color:#c0392b;vertical-align:middle; \" >应用到所有游客</b></label>");
        html.push("<div class=\"gen_table\">");

        AjaxPost("{GroupOrderGuid:'" + lineType + "', TicketBuy:'" + productbuy + "', lineSupplierGuid:'" + lineSupplierGuid + "',isFromOrder:" + IsFromOrder + "}", "/DataService/SeasonTicketProduct.asmx/SeasonTicketProductListALL", function (d) {
            html.push(d.d);
        }, null, false);

        html.push("</div>");

        //html.push("<div class=\"ia_but\">");
        //html.push("</div>");

        html.push("</div>");
        //html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        var index = $.layer({
            type: 1,
            title: "选择套票产品",
            closeBtn: [2, true],
            border: [5, 0.5, '#666', true],
            moveType: 1,
            area: ['800px', '480px'],
            page: {
                html: html.join('')
            },
            success: function () {
                $("#tbodySeasonTicket a").each(function () {
                    $(this).click(function () {

                        var IsBuy = false;
                        var MarketPrice = $("#td_" + $(this).attr("guid") + "_MarketPrice").html();
                        var SalesPrice = $("#td_" + $(this).attr("guid") + "_SalesPrice").html();
                        var RebatePrice = $("#td_" + $(this).attr("guid") + "_RebatePrice").html();

                        var SupplierGuid = $(this).attr("supplierguid");
                        var SupplierName = $("#td_" + $(this).attr("guid") + "_supplierName").html();

                        var RemainedCount = $("#td_" + $(this).attr("guid") + "_Count").html();

                        var SeasonTicketBuyGuid = $(this).attr("seasonticketbuyguid");
                        if (SeasonTicketBuyGuid != "") {
                            IsBuy = true;
                            SalesPrice = 0;
                            RebatePrice = 0;
                        }
                        //if ($("#td_" + $(this).attr("guid") + "_Count").html() != 0) {
                        //    IsBuy = true;
                        //    SalesPrice = 0;
                        //    RebatePrice = 0;
                        //}

                        var item = [];
                        item.push({
                            SeasonTicketGuid: $(this).attr("guid"),
                            Name: $("#td_" + $(this).attr("guid") + "_name").html(),
                            MarketPrice: MarketPrice,
                            SalesPrice: SalesPrice,
                            RebatePrice: RebatePrice,
                            SupplierGuid: SupplierGuid,
                            SupplierName: SupplierName,
                            SeasonTicketBuyGuid: SeasonTicketBuyGuid,
                            RemainedCount: RemainedCount,
                            IsBuy: IsBuy,
                            IsAllTourist: $("#chkAllTourist")[0].checked
                        });

                        if (callback) callback(item);
                        layer.close(index);
                    });
                });
            }
        });
    },
    //套票直接预定
    SelectSeasonTicketProductDirect: function (lineType, callback) {
        //选择套票产品
        var productbuy = "";
        var lineSupplierGuid = "";
        var html = [];
        html.push("<div class=\"form-section\">");
        html.push("<div class=\"InsuranceCls\">");
        html.push("<div class=\"jt_icon_cls\"></div>");
        html.push("<div class=\"InsuranceAdd\">");
        html.push("<div class=\"ia_info\">");
        html.push("<input type=\"checkbox\" id=\"chkAllTourist\" checked=\"checked\" class=\"bc\" name=\"bc_select\">&nbsp;<b style=\"color:#c0392b;vertical-align:middle; \" >应用到所有游客</b></label>");

        html.push("<div class=\"ia_table\">");

        AjaxPost("{lineType:'" + lineType + "', TicketBuy:'" + productbuy + "', lineSupplierGuid:'" + lineSupplierGuid + "',isFromOrder:false}", "/DataService/SeasonTicketProduct.asmx/SeasonTicketProductListALL", function (d) {
            html.push(d.d);
        }, null, false);

        html.push("</div>");

        html.push("<div class=\"ia_but\">");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        var index = $.layer({
            type: 1,
            title: "选择套票产品",
            closeBtn: [2, true],
            border: [5, 0.5, '#666', true],
            moveType: 1,
            area: ['780px', '480px'],
            page: {
                html: html.join('')
            },
            success: function () {
                $("#tbodySeasonTicket a").each(function () {
                    $(this).click(function () {
                        debugger;
                        var IsBuy = false;
                        var MarketPrice = $("#td_" + $(this).attr("guid") + "_MarketPrice").html();
                        var SalesPrice = $("#td_" + $(this).attr("guid") + "_SalesPrice").html();
                        var RebatePrice = $("#td_" + $(this).attr("guid") + "_RebatePrice").html();
                        var SupplierGuid = $(this).attr("supplierguid");
                        var SupplierName = $("#td_" + $(this).attr("guid") + "_supplierName").html();
                        var SeasonTicketBuyGuid = $(this).attr("seasonticketbuyguid");

                        var item = [];
                        item.push({
                            SeasonTicketGuid: $(this).attr("guid"),
                            Name: $("#td_" + $(this).attr("guid") + "_name").html(),
                            MarketPrice: MarketPrice,
                            SalesPrice: SalesPrice,
                            RebatePrice: RebatePrice,
                            SupplierGuid: SupplierGuid,
                            SupplierName: SupplierName,
                            SeasonTicketBuyGuid: SeasonTicketBuyGuid,
                            IsBuy: IsBuy,
                            IsAllTourist: $("#chkAllTourist")[0].checked
                        });

                        if (callback) callback(item);
                        layer.close(index);
                    });
                });
            }
        });
    },

    Reminded: function (lineGuid, groupguid, callback) {
        //特别提醒
        //debugger;
        var html = [];
        html.push("<div class=\"form-section\" style=\"width:655px\">");
        html.push("<div style=\"margin-top: 10px; height:300px;overflow-y:scroll\" id=\"Reminded\" class=\"Special_cls\">");
        html.push("<ul>");
        html.push("<li>");
        AjaxPost("{lineGuid:'" + lineGuid + "',groupguid:'" + groupguid + "'}", "/DataService/LineBooking.asmx/Reminded", function (d) {
            html.push(d.d);
        }, null, false);
        var IsChecked = "";
        AjaxPost("", "/DataService/LineBooking.asmx/RemindedIsChecked", function (d) {
            if (d.d.status) {
                if (d.d.msg == "True") {
                    IsChecked = "<label for=\"OrderNoticeIsReadSelected\"><input checked=\"checked\" type=\"checkbox\" id=\"OrderNoticeIsReadSelected\">我已阅读了解此特别说明</label>";
                } else {
                    IsChecked = "<label for=\"OrderNoticeIsReadSelected\"><input type=\"checkbox\" id=\"OrderNoticeIsReadSelected\">我已阅读了解此特别说明</label>";
                }
            }
        }, null, false);
        html.push("</li>");
        html.push("</ul>");
        html.push("</div>");
        html.push(IsChecked + "<div class=\"confirm_buy\"  style=\"margin-top:20px;\" id=\"btnOK\">确定</div>");
        html.push("</div>");
        var index = $.layer({
            type: 1,
            title: "特别提醒",
            closeBtn: [2, true],
            border: [5, 0.5, '#666', true],
            moveType: 1,
            area: ['680px', '480px'],
            page: {
                html: html.join('')
            },
            success: function () {
                $("#btnOK").bind("click", function () {
                    if (IsChecked != "") {
                        if (!$("#OrderNoticeIsReadSelected")[0].checked) {
                            MXNET_UI_LAY.Tips("请认真阅读了解此特别提醒。", $("#OrderNoticeIsReadSelected"));
                            return;
                        }
                    }
                    var item = [];
                    if (callback) callback(item);
                    layer.close(index);
                });
            }
        });

    },

    NetworkProtocol: function (callback) {
        //网络协议
        //debugger;
        var html = [];
        html.push("<div class=\"form-section\" style=\"width:680px\">");
        html.push("<div style=\"margin-top: 10px; height:400px;overflow-y:scroll;padding-left:20px;\" id=\"Reminded\" class=\"Special_cls\">");
        html.push("<ul>");
        html.push("<li>");
        AjaxPost("", "/DataService/PublicMethod.asmx/GetNetworkProtocol", function (d) {
            html.push(d.d);
        }, null, false);
        var IsChecked = "<label for=\"btnAccept\">&nbsp;<input type=\"checkbox\" checked=\"checked\" id=\"btnAccept\">我了解并接受此协议</label>";
        html.push("</li>");
        html.push("</ul>");
        html.push("</div>");
        html.push(IsChecked + "<div class=\"confirm_buy\"  style=\"margin-top:20px;\" id=\"btnOK\">确定</div>");
        html.push("</div>");
        var index = $.layer({
            type: 1,
            title: "网络协议",
            closeBtn: [2, true],
            border: [5, 0.5, '#666', true],
            moveType: 1,
            area: ['680px', '540px'],
            page: {
                html: html.join('')
            },
            success: function () {
                $("#btnOK").bind("click", function () {
                    if (IsChecked != "") {
                        if (!$("#btnAccept")[0].checked) {
                            location.href = "/Login.aspx";
                            return;
                        }
                    }
                    var item = [];
                    if (callback) callback(item);
                    layer.close(index);
                });
            }
        });

    },
    GetUnionPayNoitceProtocol: function (callback) {
        //网络协议
        //debugger;
        var html = [];
        html.push("<div class=\"form-section\" style=\"width:655px\">");
        html.push("<div style=\"margin-top: 10px; height:360px;overflow-y:scroll;padding-left:20px;\" id=\"Reminded\" class=\"Special_cls\">");
        html.push("<ul>");
        html.push("<li>");
        AjaxPost("", "/DataService/PublicMethod.asmx/GetUnionPayNoitceProtocol", function (d) {
            html.push(d.d);
        }, null, false);
        var IsChecked = "<label for=\"btnAccept\">&nbsp;<input type=\"checkbox\" checked=\"checked\" id=\"btnAccept\">我了解并接受此协议</label>";
        html.push("</li>");
        html.push("</ul>");
        html.push("</div>");
        html.push(IsChecked + "<div class=\"confirm_buy\"  style=\"margin-top:20px;\" id=\"btnOK\">确定</div>");
        html.push("</div>");
        var index = $.layer({
            type: 1,
            title: "协议",
            closeBtn: [2, true],
            border: [5, 0.5, '#666', true],
            moveType: 1,
            area: ['680px', '540px'],
            page: {
                html: html.join('')
            },
            success: function () {
                $("#btnOK").bind("click", function () {
                    if (IsChecked != "") {
                        if (!$("#btnAccept")[0].checked) {
                            debugger;
                            location.reload(); //= parent.location.href;// "/Financial/UnionPayWithHoldingBankCards.aspx";
                            return;
                        }
                    }
                    var item = [];
                    if (callback) callback(item);
                    layer.close(index);
                });
            }
        });

    },

    MapView: function (longitude, latitude, zoom) {
        var html = [];
        html.push('<div id="map_container" style="width:780px; height: 400px;" class="map-container"></div>');
        var index = $.layer({
            type: 1,
            title: "地图位置查看",
            closeBtn: [0, true],
            border: [5, 0.5, '#666', true],
            moveType: 1,
            area: ['780px', 'auto'],
            page: {
                html: html.join('')
            },
            success: function () {
                var mapContainer = new BMap.Map("map_container");
                var point = new BMap.Point(longitude, latitude);
                mapContainer.centerAndZoom(point, zoom);
                mapContainer.enableScrollWheelZoom();

                var marker = new BMap.Marker(point);                    // 创建标注
                mapContainer.addOverlay(marker);                        // 将标注添加到地图中
            }
        });
    }
};
