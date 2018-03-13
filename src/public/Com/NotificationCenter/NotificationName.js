'use strict';

module.exports = {
    search:{
        startSearch: 'com.podoon.adjusttool.startSearch',
        updateList:'com.podoon.adjusttool.List',
        stopSearch:'com.podoon.adjusttool.stopSearch',
        loseConnecting:'com.podoon.adjusttool.loseConnecting',
        reconnect:'com.podoon.adjusttool.reconnect'
    },
    deviceData: {
        voltage: 'com.podoon.adjusttool.voltage',                //读取到电量
        successSensorAdjust: 'com.podoon.adjusttool.successSensorAdjust',               //校准某传感器成功
        readInsoleData: 'com.podoon.adjusttool.readInsoleData',
        readMacAddress: 'com.podoon.adjusttool.readMacAddress',
        reciveOK: 'com.podoon.adjusttool.OK',
    }
};
