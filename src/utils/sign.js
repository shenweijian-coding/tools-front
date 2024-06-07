import md5 from 'js-md5';
export default {
	//请求头header配置，data是请求的参数
    getBaseHeaders(data) {
        let dataSort = this.sortByKey(data);
        let dataStr = this.strJoin(dataSort);
        let urlStr = window.location.origin;
        let timestamp = new Date().getTime();
        let nonceStr = Math.random().toString(36).substr(2);
        //生成前端签名
        let signature = md5(dataStr + '&timestamp=' + timestamp + '&nonce=' + nonceStr + '&url=' + urlStr);
        let postBaseHeaders = {
            timestamp: timestamp,
            nonce: nonceStr,
            signature: signature,
        };
        return postBaseHeaders;
    },
    //参数排序
    sortByKey(obj) {
        const newkey = Object.keys(obj).sort();
        let newObj = {};
        for (let i = 0; i < newkey.length; i++) {
            if(obj[newkey[i]] != undefined || obj[newkey[i]] != null) {
                newObj[newkey[i]] = obj[newkey[i]];
            }
        }
        return newObj;
    },
    //参数序列化
    strJoin(resData) {
        let i = 0;
        let str = '';
        let strJoint = '';
        let arr = Object.keys(resData);
        for (let key in resData) {
            str = key + '=' + resData[key];
            i++;
            if (i < arr.length) {
                strJoint = strJoint + str + '&';
            } else if (i == arr.length) {
                strJoint = strJoint + str;
            }
        }
        // console.log(strJoint);
        return strJoint;
    },
};
