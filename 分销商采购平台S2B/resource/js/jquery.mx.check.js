var formCheck = {
    isNumber: function (str) {
        //纯数字验证
        var numberPat = /^\d+$/i;
        return numberPat.test(str);
    },
    isFloatNumber: function (str) {
        //带小数点的数字验证
        var numberPat = /^\d*\.\d{1,2}$/i;
        return numberPat.test(str);
    },
    isNumberAndFloatNumber: function (str) {
        //可整数可一到二位小数点的数字验证
        var numberPat = /^[0-9]+(\.[0-9]{1,2})?$/i;
        return numberPat.test(str);
    },
    isNumberAndFloatNumberAllowNegative: function (str) {
        //可整数可一到二位小数点的数字验证
        var numberPat = /^[-]?[0-9]+(\.[0-9]{1,2})?$/i;
        return numberPat.test(str);
    },
    isEmail: function (str) {
        //邮件规则:
        var numberPat = /^(\w|.)+@\w+(.[\w]{2,5}){1,5}$/i;
        return numberPat.test(str);
    },
    isDate: function (str) {
        //日期规则:
        var numberPat = /^(1|2)[0-9]{3}\-[0-9]{1,2}\-[0-9]{1,2}$/gi;
        return numberPat.test(str);
    },
    isAccount: function (str) {
        //帐号规则:由字母或数字或下划线，以字母开头，最多18或最小6个字符组成。
        var numberPat = /^\w{6,18}$/i;
        return numberPat.test(str);
    },
    isMemAccount: function (str) {
        //帐号规则:由字母或数字或下划线，以字母开头，最多18或最小6个字符组成。
        var numberPat = /^[A-Za-z]{1}[a-zA-Z0-9.@_\-]{5,17}$/i;
        return numberPat.test(str);
    },
    isPassword: function (str) {
        //密码规则6-18位任意字符
        var numberPat = /^(\w|\W){6,18}$/i;
        return numberPat.test(str);
    },
    isPasswords: function (str) {
        //密码规则：6-18位数字和字母（比有数字和字母）
        var numberPat = /^(?![0-9]+$)(?![a-zA-Z]+$)[!"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~A-Za-z0-9]{6,18}$/i;
        return numberPat.test(str);
    },
    isPhone: function (str) {
        //验证电话号
        var numberPat = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/i;
        return numberPat.test(str);
    },
    isMobile: function (str) {
        //验证手机号
        var numberPat = /^1[0-9]{10}$/i;
        return numberPat.test(str);
    },
    isMobiles: function (str) {
        //验证手机号
        var numberPat = /^(17[0-9]|13[0-9]|15[0-9]|18[0-9])\d{8}$/;
        return numberPat.test(str);
    },
    isIDCard: function (idCard) {
        var _self = formCheck;
        idCard = idCard.replace(/ /g, "");                          //去掉字符串头尾空格
        if (idCard.length == 15) {
            return _self.isValidityBrithBy15IdCard(idCard);         //进行15位身份证的验证    
        } else if (idCard.length == 18) {
            var a_idCard = idCard.split("");                        // 得到身份证数组   
            if (_self.isValidityBrithBy18IdCard(idCard) && _self.isTrueValidateCodeBy18IdCard(a_idCard)) {   //进行18位身份证的基本验证和第18位的验证
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    isValidityBrithBy15IdCard: function (idCard15) {
        var year = idCard15.substring(6, 8);
        var month = idCard15.substring(8, 10);
        var day = idCard15.substring(10, 12);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
        if (temp_date.getYear() != parseFloat(year)
                || temp_date.getMonth() != parseFloat(month) - 1
                || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    },
    isTrueValidateCodeBy18IdCard: function (aIdCard) {
        var sum = 0;                             // 声明加权求和变量
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];    // 加权因子   
        var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];            // 身份证验证位值.10代表X 
        if (aIdCard[17].toLowerCase() == 'x' || aIdCard[17].toLowerCase() == 'X') {
            aIdCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
        }
        for (var i = 0; i < 17; i++) {
            sum += Wi[i] * aIdCard[i];            // 加权求和   
        }
        valCodePosition = sum % 11;                // 得到验证码所位置   
        if (aIdCard[17] == ValideCode[valCodePosition]) {
            return true;
        } else {
            return false;
        }
    },
    isValidityBrithBy18IdCard: function (idCard18) {
        var year = idCard18.substring(6, 10);
        var month = idCard18.substring(10, 12);
        var day = idCard18.substring(12, 14);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题   
        if (temp_date.getFullYear() != parseFloat(year)
              || temp_date.getMonth() != parseFloat(month) - 1
              || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    },
    IDCardSexBirthday: function (idcard) {
        var birthdayValue;
        var sexId;
        var sexText;
        var age;
        switch (idcard.length) {
            case 15:
                birthdayValue = idcard.charAt(6) + idcard.charAt(7);
                if (parseInt(birthdayValue) < 10) {
                    birthdayValue = '20' + birthdayValue;
                }
                else {
                    birthdayValue = '19' + birthdayValue;
                }
                birthdayValue = birthdayValue + '-' + idcard.charAt(8) + idcard.charAt(9) + '-' + idcard.charAt(10) + idcard.charAt(11);
                if (parseInt(idcard.charAt(14) / 2) * 2 != idcard.charAt(14)) {
                    sexId = "6";
                    sexText = "男";
                }
                else {
                    sexId = "7";
                    sexText = "女";
                }
                break;
            case 18:
                birthdayValue = idcard.charAt(6) + idcard.charAt(7) + idcard.charAt(8) + idcard.charAt(9) + '-' + idcard.charAt(10) + idcard.charAt(11) + '-' + idcard.charAt(12) + idcard.charAt(13);
                if (parseInt(idcard.charAt(16) / 2) * 2 != idcard.charAt(16)) {
                    sexId = "6";
                    sexText = "男";
                }
                else {
                    sexId = "7";
                    sexText = "女";
                }
                break;
        }

        //年龄
        var dt1 = new Date(birthdayValue.replace("-", "/"));
        var dt2 = new Date();
        var age = dt2.getFullYear() - dt1.getFullYear();
        var m = dt2.getMonth() - dt1.getMonth();
        if (m < 0)
            age--;
        //alert(birthdayValue + sexId + sexText + age);

        return birthdayValue + "|" + sexId;
    },
    //两个时间大小的比较
    checkEndTime: function (startTime, endTime) {
        var start = new Date(startTime.replace("-", "/").replace("-", "/"));
        var end = new Date(endTime.replace("-", "/").replace("-", "/"));
        if (end < start) {
            return false;
        }
        return true;
    },
    isColor: function (str) {
        //判断是否是颜色值
        var numberPat = /^#[0-9a-fA-F]{6}$/i;
        return numberPat.test(str);
    },
    //2016-08-02 fandongzhi 
    isUploadFile: function (str) {
        //判断是否是上传文件类型
        var numberPat = /^(docx|doc|xls|xlsx|rar|zip|pdf|txt|jpg)$/i;
        return (str && numberPat.test(str));
    }
};