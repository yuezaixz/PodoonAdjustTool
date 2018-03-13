import * as types from '../constants/ActionTypes';

const initialState = {

}

export default function(state = {index: 0}, action) {
    switch(action.type) {
        case types.START_READ_VOLTAGE:
            return {...state, isReadingVoltage: true};
        case types.READ_VOLTAGE:
            return {...state, isReadingVoltage: false, voltage: action.voltage};
        case types.START_READ_MAC_ADDRESS:
            return {...state, isReadingMacAddress: true};
        case types.READ_MAC_ADDRESS:
            return {...state, isReadingMacAddress: false, macAddress: action.macAddress};
        /****************传感器校准****************/
        case types.START_READ_INSOLE_DATA:
            return {...state, isReadingInsoleData: true};
        case types.STOP_READ_INSOLE_DATA:
            return {...state, isReadingInsoleData: false};
        case types.READ_INSOLE_DATA:
            return {...state, point1: action.point1, point2: action.point2, point3: action.point3};

        //开始校准,进入退出校准模式
        case types.START_ADJUST:
            return {...state, isStartAdjust: true, point1Val:0, point2Val:0, point3Val:0};
        case types.SUCCESS_START_ADJUST:
            return {...state, isStartAdjust: false};
        case types.STOP_ADJUST:
            return {...state, isStopAdjust: true};
        case types.SUCCESS_STOP_ADJUST:
            return {...state, isStopAdjust: false};
        //校准传感器
        case types.SENSOR_ADJUST:
            return {...state, isSensorAdjust: true};
        case types.SUCCESS_SENSOR_ADJUST:
            return {...state,
                isSensorAdjust: false,
                point1Val:action.index == 0?action.val:state.point1Val,
                point2Val:action.index == 1?action.val:state.point2Val,
                point3Val:action.index == 2?action.val:state.point3Val ,
                completeSensorIndex:action.isSuccess? new Set([...(state.completeSensorIndex || []), action.index]):new Set(state.completeSensorIndex || []),
                errorSensorIndex:!action.isSuccess? new Set([...(state.errorSensorIndex || []), action.index]):new Set(state.errorSensorIndex || [])
            };
        case types.CLEAR_DEVICE_DATA:
            return {...state,  voltage: 0, completeSensorIndex:new Set([]), errorSensorIndex:new Set([])}
    }

    return state;
}