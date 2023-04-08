var previous = 0;
export default {
    /**
     * 替换数组位置
     * @index1 {number} 交换位置的第一个索引
     * @index2 {number} 交换位置的第二个索引
     * @data  改变数据
     */
    changeIndex(data, index1, index2) {
        let newArr = [];
        newArr = data[index1] = data.splice(index2, 1, data[index1])[0];
        return newArr;
    },
    //以当前时间为准 计算前后几天的时间
    getDay(day) {
        function doHandleMonth(month) {
            var m = month;
            if (month.toString().length == 1) {
                m = '0' + month;
            }
            return m;
        }
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = doHandleMonth(tMonth + 1);
        tDate = doHandleMonth(tDate);
        // return tYear + "-" + tMonth + "-" + tDate + " " + tHour + ":" + tMinute + ":" + tSecond;
        return tYear + '-' + tMonth + '-' + tDate;
    },
    //小于10的格式化函数
    timeFormat(param) {
        return param < 10 ? '0' + param : param.toString();
    },
    /*
     * 核心方法，实现加减乘除运算，确保不丢失精度
     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
     *
     */
    operation(a, b, op) {
        function isInteger(obj) {
            return Math.floor(obj) === obj;
        }
        function toInteger(floatNum) {
            var ret = { times: 1, num: 0 };
            if (isInteger(floatNum)) {
                ret.num = floatNum;
                return ret;
            }
            var strfi = floatNum + '';
            var dotPos = strfi.indexOf('.');
            var len = strfi.substr(dotPos + 1).length;
            var times = Math.pow(10, len);
            var intNum = parseInt(floatNum * times + 0.5, 10);
            ret.times = times;
            ret.num = intNum;
            return ret;
        }
        var o1 = toInteger(a);
        var o2 = toInteger(b);
        var n1 = o1.num;
        var n2 = o2.num;
        var t1 = o1.times;
        var t2 = o2.times;
        var max = t1 > t2 ? t1 : t2;
        var result = null;
        switch (op) {
            case 'add':
                if (t1 === t2) {
                    // 两个小数位数相同
                    result = n1 + n2;
                } else if (t1 > t2) {
                    // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2);
                } else {
                    // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2;
                }
                return result / max;
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2;
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2);
                } else {
                    result = n1 * (t2 / t1) - n2;
                }
                return result / max;
            case 'multiply':
                result = (n1 * n2) / (t1 * t2);
                return result;
            case 'divide':
                result = (n1 / n2) * (t2 / t1);
                return result;
        }
    },
    /**
     * 获取两个时间点的时间差，并以格式化输出
     * @return obj {day,hour,min,sec}
     */
    getFormatDeltaTime(newTime, endTime) {
        let obj;
        if (endTime - newTime > 0) {
            let time = (endTime - newTime) / 1000;
            // 获取天、时、分、秒
            let day = parseInt(time / (60 * 60 * 24));
            let hou = parseInt((time % (60 * 60 * 24)) / 3600);
            let min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60);
            let sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60);
            obj = {
                day: this.timeFormat(day),
                hou: this.timeFormat(hou),
                min: this.timeFormat(min),
                sec: this.timeFormat(sec)
            };
        } else {
            obj = {
                day: '00',
                hou: '00',
                min: '00',
                sec: '00'
            };
        }
        return obj;
    },

    /**
     * Date 转化为指定格式的String<br>
     * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)可以用 1-2 个占位符<br>
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     *
     * @param {string | number} date string支持形式：20160126 12:00:00，2016-01-26 12:00:00，2016.01.26 12:00:00，20160126，2016-01-26 12:00:00.0
     * @param {string} fmt
     * @returns {string}
     * @example
     *
     * formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss.S');
     * // => 2006-07-02 08:09:04.423
     *
     * formatDate(Date.now(), 'yyyy-MM-dd E HH:mm:ss');
     * // => 2009-03-10 二 20:09:04
     *
     * formatDate(Date.now(), 'yyyy-MM-dd EE hh:mm:ss');
     * // => 2009-03-10 周二 08:09:04
     *
     * formatDate(Date.now(), 'yyyy-MM-dd EEE hh:mm:ss');
     * // => 2009-03-10 星期二 08:09:04
     *
     * formatDate(Date.now(), 'yyyy-M-d h:m:s.S')
     * // => 2006-7-2 8:9:4.18
     */
    formatDate(date, fmt) {
        if (date === void 0) date = new Date();
        if (fmt === void 0) fmt = 'yyyy-MM-dd HH:mm:ss';
        if (typeof date === 'string') {
            date = new Date(this.formatTimeByPattern(date));
        } else if (typeof date === 'number') {
            date = new Date(date);
        }
        var o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
            'H+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds() // 毫秒
        };
        var week = {
            '0': '\u65e5',
            '1': '\u4e00',
            '2': '\u4e8c',
            '3': '\u4e09',
            '4': '\u56db',
            '5': '\u4e94',
            '6': '\u516d'
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') +
                    week[date.getDay() + '']
            );
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
            }
        }
        return fmt;
    },
    randomString(e) {
        e = e || 14;
        var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
            a = t.length,
            n = '';
        for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n;
    }
};
