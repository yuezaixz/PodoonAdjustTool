import * as types from '../constants/ActionTypes';
import * as BleUUIDs from '../constants/BleUUIDs';
import PillowManager from '../manager/PillowManager'

export function startSearchDevice() {
    if (PillowManager.ShareInstance().isSearching) {
        return {type: types.START_SEARCH_DEVICE}
    }


    return async (dispatch, getState) => {
        PillowManager.ShareInstance().startSearchDevice().then(() => {
            dispatch({type: types.START_SEARCH_DEVICE})
        }).catch(error => {
            console.log(error)
            //重复开始，暂不处理了
        })
    }
}

export function updateDeviceList(list) {
    return {type: types.UPDATE_DEVICE_LIST, devices: list}
}

export function stopSearchDevice() {
    PillowManager.ShareInstance().stopSearchDevice()
    return {type: types.STOP_SEARCH_DEVICE}
}

export function startDeviceConnect(device) {
    return async (dispatch, getState) =>{
        dispatch({type: types.STOP_SEARCH_DEVICE})
        dispatch({type: types.START_DEVICE_CONNECT, uuid: device.uuid})
        PillowManager.ShareInstance().startDeviceConnect(device)
            .then((device)=>{
                dispatch({
                    type: types.SUCCESS_DEVICE_CONNECT,
                    uuid: device.uuid,
                    name: device.name,
                    serviceUUID:BleUUIDs.PODOON_SERVICE_UUID,
                    noitfyUUID: device.noitfyUUID,
                    writeUUID: device.writeUUID})
            }).catch(error => {
                dispatch({type: types.FAIL_DEVICE_CONNECT, errorMsg: error})

        })
    }
}
