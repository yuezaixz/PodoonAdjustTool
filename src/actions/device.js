import * as types from '../constants/ActionTypes';
import * as APIs from '../constants/ServerAPIs';
import PillowManager from '../manager/PillowManager'
import * as Utils from '../utils/Utils'
import NetUtil from '../utils/NetUtils'

export function uploadRecord(macAddress, point1Val, point2Val ,point3Val, voltage, callback) {
    let recordTime = Utils.formatTime(new Date())
    return async (dispatch, getState) =>{
        //dispatch start fetch action
        dispatch({type: types.START_UPLOAD_RECORD});

        let data = {
            mac_address:macAddress,
            point1_vector:point1Val,
            point2_vector:point2Val ,
            point3_vector:point3Val,
            voltage,
            record_time:recordTime
        }

        NetUtil.postJson(APIs.uploadRecord, data, (responseData)=>{
            console.log(responseData)
            callback()
            dispatch({type: types.SUCCESS_UPLOAD_RECORD});
        })
    }
}

export function deviceDisconnect(uuid) {
    return async (dispatch, getState) =>{
        dispatch({type: types.DEVICE_DISCONNECT, uuid: uuid})
        PillowManager
            .ShareInstance()
            .deviceDisconnect(uuid)
            .then(()=>{
                dispatch({type: types.SUCCESS_DEVICE_DISCONNECT, uuid: uuid})
            })
            .catch((error) => {
                dispatch({type: types.FAIL_DEVICE_DISCONNECT, errorMsg: error})
            });
    }



    return {type: types.DEVICE_DISCONNECT}
}

export function startCheckVoltage() {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startCheckVoltage()
            .then(()=>{
                dispatch({type: types.START_CHECK_VOLTAGE})
            })
    }
}

export function startReadVoltage() {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startReadVoltage()
            .then(()=>{
                dispatch({type: types.START_READ_VOLTAGE})
            })
    }
}

export function readVoltage(voltage) {
    return {type: types.READ_VOLTAGE, voltage}
}

export function startReadMacAddress() {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startReadMacAddress()
            .then(()=>{
                dispatch({type: types.START_READ_MAC_ADDRESS})
            })
    }
}

export function readMacAddress(macAddress) {
    return {type: types.READ_MAC_ADDRESS, macAddress}
}

/****************传感器校准****************/

export function startReadInsoleData() {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startReadInsoleData()
            .then(()=>{
                dispatch({type: types.START_READ_INSOLE_DATA})
            })
    }
}

export function stopReadInsoleData() {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().stopReadInsoleData()
            .then(()=>{
                dispatch({type: types.STOP_READ_INSOLE_DATA})
            })
    }
}

export function readInsoleData(point1, point2, point3) {
    return {type: types.READ_INSOLE_DATA, point1, point2, point3}
}

//开始校准,进入退出校准模式
export function startAdjust() {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startAdjust()
            .then(()=>{
                dispatch({type: types.START_ADJUST})
            })
    }
}

export function successStartAdjust() {
    return {type: types.SUCCESS_START_ADJUST}
}

export function stopAdjust() {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().stopAdjust()
            .then(()=>{
                dispatch({type: types.STOP_ADJUST})
            })
    }
}

export function successStopAdjust() {
    return {type: types.SUCCESS_STOP_ADJUST}
}

export function sensorAdjust(index, val) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().sensorAdjust(index, val)
            .then(()=>{
                dispatch({type: types.SENSOR_ADJUST, index})
            })
    }
}

export function recordSensorAdjust(index) {
    return {type: types.RECORD_SENSOR_ADJUST, index}
}

export function successSensorAdjust(index) {
    return {type: types.SUCCESS_SENSOR_ADJUST, index}
}

export function reAdjust(index) {
    return {type: types.RE_ADJUST, index}
}

export function clearDeviceData() {
    return {type: types.CLEAR_DEVICE_DATA}
}