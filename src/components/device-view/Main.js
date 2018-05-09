import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage,
    TouchableHighlight,
    Dimensions, NativeEventEmitter, NativeModules
} from 'react-native';
import {Theme} from "../../styles";
import * as util from "../../utils/InsoleUtils"
import * as StorageKeys from '../../constants/StorageKeys'

import NotificationCenter from '../../public/Com/NotificationCenter/NotificationCenter'


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

let {height, width} = Dimensions.get('window');

class Main extends Component {
    stdVoltage = 3.8

    handleVoltage = ()=>{
        this.props.actions.startReadVoltage(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
        this.props.getLoading().show()
    }
    handleAdjustPoint = (index)=>{
        this.props.actions.recordSensorAdjust(index)
    }
    handleReAdjustPoint = (index)=>{
        this.props.actions.reAdjust(index)
    }
    voltageIsPassed = (voltage, stdVoltage)=> {
        return voltage > stdVoltage
    }
    componentWillMount() {
        AsyncStorage.getItem(StorageKeys.STD_VOLTAGE,function (error, result) {
            if (!error && result) {
                this.stdVoltage = parseInt(result)
            }
        }.bind(this))
    }

    readMacAddress(data) {
        if (data.macAddress) {
            this.props.actions.readMacAddress(data.macAddress)
            this.props.actions.startReadAdjust()
        }
    }

    readAdjust(data) {
        if ((data.point1Val+data.point2Val+data.point3Val)) {
            this.props.actions.readAdjust(data.point1Val, data.point2Val, data.point3Val)
            this.props.actions.startCheckVoltage()
        }
    }

    readVoltage(data) {
        if (data.voltage) {
            this.props.actions.readVoltage(data.voltage)
            this.props.actions.startReadInsoleData()
       }
        this.props.getLoading().dismiss()
    }

    reciveOK(data) {
        if (this.props.device_data.isStartAdjust) {
            this.props.actions.successStartAdjust()
            setTimeout(()=>{
                this.props.actions.sensorAdjust(1, this.props.device_data.point1Val)
            },200)
            this.props.getLoading().dismiss()
            this.props.getLoading().show('校准一号点')
        } else if (this.props.device_data.isPoint1SensorAdjust) {
            this.props.actions.successSensorAdjust(1)
            setTimeout(()=>{
                this.props.actions.sensorAdjust(2, this.props.device_data.point2Val)
            })
            this.props.getLoading().dismiss()
            this.props.getLoading().show('校准二号点')
        } else if (this.props.device_data.isPoint2SensorAdjust) {
            this.props.actions.successSensorAdjust(2)
            setTimeout(()=>{
                this.props.actions.sensorAdjust(3, this.props.device_data.point3Val)
            },200)
            this.props.getLoading().dismiss()
            this.props.getLoading().show('校准三号点')
        } else if (this.props.device_data.isPoint3SensorAdjust) {
            this.props.actions.successSensorAdjust(3)
            setTimeout(()=>{
                this.props.actions.stopAdjust()
                this.props.actions.clearDeviceData()
            },200)
            this.props.navigation.pop()
            this.props.getLoading().dismiss()
            this.props.getLoading().show('校准完成')
        }
    }

    readInsoleData(data) {
        if (data) {
            this.props.actions.readInsoleData(data.point1, data.point2, data.point3)
        }
        this.props.getLoading().dismiss()
    }

    disconnectHandle(){
        // console.log('recive loseConnecting')
        // this.props.getLoading().show('已断开')
    }

    reconnectHandle(){
        // console.log('recive reconnect')
        // this.props.getLoading().dismiss()
    }

    componentDidMount() {
        this.voltageListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.voltage, this.readVoltage.bind(this), '');
        this.reciveOKListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.reciveOK, this.reciveOK.bind(this), '');
        this.macAddressListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.readMacAddress, this.readMacAddress.bind(this), '');
        this.readAdjustListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.readAdjust, this.readAdjust.bind(this), '');
        this.readInsoleDataListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.readInsoleData, this.readInsoleData.bind(this), '');
        this.disconnectListener = NotificationCenter.createListener(NotificationCenter.name.search.loseConnecting, this.disconnectHandle.bind(this), '');
        this.reconnectListener = NotificationCenter.createListener(NotificationCenter.name.search.reconnect, this.reconnectHandle.bind(this), '');
    }
    componentWillUnmount() {
        NotificationCenter.removeListener(this.voltageListener);
        NotificationCenter.removeListener(this.macAddressListener);
        NotificationCenter.removeListener(this.readAdjustListener);
        NotificationCenter.removeListener(this.disconnectListener);
        NotificationCenter.removeListener(this.reconnectListener);
        NotificationCenter.removeListener(this.readInsoleDataListener);
        NotificationCenter.removeListener(this.reciveOKListener);
    }
    componentDidUpdate () {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.voltage_block}>
                    <View style={styles.block_line} />
                    <Text style={styles.block_title}>电压测试</Text>
                    <View style={styles.block_main} >
                        <Text style={[styles.block_main_text,this.props.device_data.voltage?(this.voltageIsPassed(parseInt(this.props.device_data.voltage),this.stdVoltage*1000)?styles.text_passed:styles.text_fail):null]}>
                            电压:{this.props.device_data.voltage || '--'}mV
                        </Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right]}
                            onPress={this.handleVoltage.bind(this)}>
                            <Text style={[styles.block_main_button_text]}>
                                读取
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={styles.adjust_block}>
                    <View style={styles.block_line} />
                    <Text style={[styles.block_title,styles.block_title_middle]}>传感器校准</Text>
                    <View style={styles.block_main} >
                        <Text style={[styles.block_main_text,this.props.device_data.point1Val?styles.text_passed:styles.text_normal]}>1#{this.props.device_data.point1Val || this.props.device_data.point1}</Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right,{width:140}]}
                            onPress={()=>{this.props.device_data.point1Val?this.handleReAdjustPoint(1):this.handleAdjustPoint(1)}}>
                            <Text style={[styles.block_main_button_text]}>
                                {this.props.device_data.point1Val?"重新采集":"校准当前值"}
                            </Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.block_main} >
                        <Text style={[styles.block_main_text,this.props.device_data.point2Val?styles.text_passed:styles.text_normal]}>2#{this.props.device_data.point2Val || this.props.device_data.point2}</Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right,{width:140}]}
                            onPress={()=>{this.props.device_data.point2Val?this.handleReAdjustPoint(2):this.handleAdjustPoint(2)}}>
                            <Text style={[styles.block_main_button_text]}>
                                {this.props.device_data.point2Val?"重新采集":"校准当前值"}
                            </Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.block_main} >
                        <Text style={[styles.block_main_text,this.props.device_data.point3Val?styles.text_passed:styles.text_normal]}>3#{this.props.device_data.point3Val || this.props.device_data.point3}</Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right,{width:140}]}
                            onPress={()=>{this.props.device_data.point3Val?this.handleReAdjustPoint(3):this.handleAdjustPoint(3)}}>
                            <Text style={[styles.block_main_button_text]}>
                                {this.props.device_data.point3Val?"重新采集":"校准当前值"}
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:8
    },
    voltage_block: {
        flex:2
    },
    adjust_block: {
        flex:6
    },
    block_title: {
        flex:1,
        width:80,
        backgroundColor: '#FFFFFF',
        alignSelf:'center',
        textAlign:'center'
    },
    block_title_middle: {
        width:120
    },
    block_title_long: {
        width:140
    },
    block_line: {
        backgroundColor: '#000000',
        position: 'absolute',
        top:7,
        left: 20,
        height:1,
        right:20
    },
    block_main: {
        flex:3,
        flexDirection:'row',
        paddingLeft:30,
        paddingRight:30,
        paddingTop:10
    },
    block_main_big: {
        flex:4.7
    },
    block_main_text: {
        fontSize:17
    },
    block_main_button: {
        backgroundColor:'#D8D8D8',
        borderColor:'#979797',
        borderWidth:1
    },
    block_main_button_right: {
        position:'absolute',
        top:0,
        right:30,
        width:70,
        height:35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    block_main_button_text: {
        fontSize:17,
        color:'#000000',
    },
    shadow_btn: {
        width: 50,
        height: 30,
        borderWidth:1,
        borderRadius:10,
        backgroundColor:'#AAAAAA',
        position:'absolute',
        right:20,
        alignItems:'center',
        justifyContent:'center'
    },
    insole_info: {
        paddingTop:20,
        height: 60,
        width:width
    },
    text_normal: {
        color: '#000000'
    },
    text_passed: {
        color:'#7ED321'
    },
    text_fail: {
        color: '#E85613'
    },
    title: {
        textAlign: 'center',
        fontSize: 17,
        position:'relative'
    }
});

export default Main;
