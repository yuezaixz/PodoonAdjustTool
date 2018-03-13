'use strict';
import React, {Component} from 'react';

class NetUtil extends Component {

    /**
     * get请求
     *url : 请求地址
     *callback : 回调函数
     */
    static get(url, callback) {
        var fetchOptions = {
            method: 'GET',
            headers: {
                // 如果有KEY信息的话
                // 'appID': 'M401fErHUPYhDKmgp0wjqVRX-gzGzoHsz',
                // 'appKey': 'Jqnvt1Lmt34vQh1JDRUpRAqq'
            }
        };
        fetch(url, fetchOptions)
            .then((response) => response.text())
            .then((responseText) => {
                callback(JSON.parse(responseText));
            }).done();
    }

    /**
     * delete请求
     *url : 请求地址
     *callback : 回调函数
     */
    static delete(url, callback) {
        var fetchOptions = {
            method: 'DELETE',
            headers: {
                // 如果有KEY信息的话
                // 'appID': 'M401fErHUPYhDKmgp0wjqVRX-gzGzoHsz',
                // 'appKey': 'Jqnvt1Lmt34vQh1JDRUpRAqq'
            }
        };
        fetch(url, fetchOptions)
            .then((response) => response.text())
            .then((responseText) => {
                callback(JSON.parse(responseText));
            }).done();
    }
    /**
     * post请求
     * url : 请求地址
     * data : 参数(Json对象)
     * callback : 回调函数
     * */
    static postJson(url, data, callback) {
        var fetchOption = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 如果有KEY信息的话
                // 'appID': 'M401fErHUPYhDKmgp0wjqVRX-gzGzoHsz',
                // 'appKey': 'Jqnvt1Lmt34vQh1JDRUpRAqq'
            },
            body: JSON.stringify(data)
        };

        fetch(url, fetchOption)
            .then((response) => response.text())
            .then((responseText) => {
                callback(JSON.parse(responseText))
            })
            .done();
    }
    /**
     * put请求
     * url : 请求地址
     * data : 参数(Json对象)
     * callback : 回调函数
     * */
    static putJson(url, data, callback) {
        var fetchOption = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 如果有KEY信息的话
                // 'appID': 'M401fErHUPYhDKmgp0wjqVRX-gzGzoHsz',
                // 'appKey': 'Jqnvt1Lmt34vQh1JDRUpRAqq'
            },
            body: JSON.stringify(data)
        };

        fetch(url, fetchOption)
            .then((response) => response.text())
            .then((responseText) => {
                callback(JSON.parse(responseText))
            })
            .done();
    }
}

export default NetUtil;