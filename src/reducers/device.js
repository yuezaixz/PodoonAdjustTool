import * as types from '../constants/ActionTypes';

const initialState = {

}

export default function(state = {index: 0}, action) {
    switch(action.type) {
        case types.START_UPLOAD_RECORD:
            return {...state, isUploadingRecord: true};
        case types.SUCCESS_UPLOAD_RECORD:
            return {...state, isUploadingRecord: true};
        case types.START_READ_VOLTAGE:
            return {...state, isReadingVoltage: true};
        case types.READ_VOLTAGE:
            return {...state, isReadingVoltage: false, voltage: action.voltage};
        case types.START_READ_MAC_ADDRESS:
            return {...state, isReadingMacAddress: true};
        case types.READ_MAC_ADDRESS:
            return {...state, isReadingMacAddress: false, macAddress: action.macAddress};
        case types.START_READ_ADJUST:
            return {...state, isReadingAdjust: true};
        case types.READ_ADJUST:
            return {...state, isReadingAdjust: false, done1Val: action.point1Val, done2Val: action.point2Val, done3Val: action.point3Val};
        /****************传感器校准****************/
        case types.START_READ_INSOLE_DATA:
            return {...state, isReadingInsoleData: true};
        case types.STOP_READ_INSOLE_DATA:
            return {...state, isReadingInsoleData: false};
        case types.READ_INSOLE_DATA:
            return {...state, point1: action.point1, point2: action.point2, point3: action.point3};

        //开始校准,进入退出校准模式
        case types.START_ADJUST:
            return {...state, isStartAdjust: true,
                isPoint1SensorAdjust :false, isPoint2SensorAdjust :false, isPoint3SensorAdjust :false};
        case types.SUCCESS_START_ADJUST:
            return {...state, isStartAdjust: false};
        case types.STOP_ADJUST:
            return {...state, isStopAdjust: true};
        case types.SUCCESS_STOP_ADJUST:
            return {...state, isStopAdjust: false};
        //校准传感器
        case types.SENSOR_ADJUST:
            return {...state,
                isPoint1SensorAdjust: action.index == 1?true:state.isPoint1SensorAdjust,
                isPoint2SensorAdjust: action.index == 2?true:state.isPoint2SensorAdjust,
                isPoint3SensorAdjust: action.index == 3?true:state.isPoint3SensorAdjust
            };
        case types.SUCCESS_SENSOR_ADJUST:
            return {...state,
                isSensorAdjust: false,
                isPoint1SensorAdjust: action.index == 1?false:state.isPoint1SensorAdjust,
                isPoint2SensorAdjust: action.index == 2?false:state.isPoint2SensorAdjust,
                isPoint3SensorAdjust: action.index == 3?false:state.isPoint3SensorAdjust
            };
        case types.RECORD_SENSOR_ADJUST:
            return {...state,
                isSensorAdjust: false,
                point1Val:action.index == 1?state.point1:state.point1Val,
                point2Val:action.index == 2?state.point2:state.point2Val,
                point3Val:action.index == 3?state.point3:state.point3Val
            };
        case types.CLEAR_DEVICE_DATA:
            return {...state,  voltage: 0, point1: 0 , point2: 0 , point3: 0 , point1Val: 0 , point2Val: 0 , point3Val: 0 ,
                isPoint1SensorAdjust :false, isPoint2SensorAdjust :false, isPoint3SensorAdjust :false, done1Val: 0,
                done2Val: 0, done3Val: 0  }
        case types.RE_ADJUST:
            return {...state,
                point1Val:action.index == 1?0:state.point1Val,
                point2Val:action.index == 2?0:state.point2Val,
                point3Val:action.index == 3?0:state.point3Val }
    }

    return state;
}