import * as types from '../constants/ActionTypes';
import PillowManager from '../manager/PillowManager'

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

export function readMacAddress(voltage) {
    return {type: types.READ_MAC_ADDRESS, voltage}
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

export function sensorAdjust(index) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().sensorAdjust(index)
            .then(()=>{
                dispatch({type: types.SENSOR_ADJUST})
            })
    }
}

export function successSensorAdjust(index, val) {
    return {type: types.SUCCESS_SENSOR_ADJUST, index, val}
}