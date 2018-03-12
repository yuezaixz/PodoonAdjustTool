'use strict';

module.exports = {
    search:{
        startSearch: 'com.podoon.ztproduct.startSearch',
        updateList:'com.podoon.ztproduct.List',
        stopSearch:'com.podoon.ztproduct.stopSearch',
        loseConnecting:'com.podoon.ztproduct.loseConnecting',
        reconnect:'com.podoon.ztproduct.reconnect'
    },
    deviceData: {
        voltage: 'com.podoon.ztproduct.voltage',                //读取到电量
        successSensorAdjust: 'com.podoon.ztproduct.successSensorAdjust',               //校准某传感器成功
        readInsoleData: 'com.podoon.ztproduct.readInsoleData',               //收到ACK通知
    }
};
