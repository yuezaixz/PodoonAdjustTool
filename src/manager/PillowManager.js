import BleManager from 'react-native-ble-manager';
import {
    Platform,
    NativeEventEmitter,
    NativeModules
} from 'react-native';
import * as BleUUIDs from "../constants/BleUUIDs";
import * as util from "../utils/InsoleUtils";
import NotificationCenter from '../public/Com/NotificationCenter/NotificationCenter'
import { stringToBytes } from 'convert-string';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

let instance = null;

const indexMap = {
    '01':0,
    '02':1,
    '03':2,
    '04':3,
    '05':4,
    '06':5,
    '07':6,
    '08':7,
    '09':8,
    '0A':9,
    '0B':10,
    '0C':11,
    '0D':12,
    '0E':13,
    '0F':14,
    '10':15,
}

const sensorIndexCMDMap = ['01','02','03','04','05','06','07','08','09','0A','0B','0C','0D','0E','0F','10']
//传感器校准，1~16个传感器的校准

export default class PillowManager{
    loopTimer = 0;
    isSearching = false;
    lastUpdateTime = 0;
    loopCallback = null;
    device_list = [];
    current_pillow = null

    isLoseConnecting = false;

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    reconnect() {
        console.log('开始重连')
        if (this.isLoseConnecting){
            this.startDeviceConnect(this.current_pillow).then((device)=>{
                this.isLoseConnecting = true
                NotificationCenter.post(NotificationCenter.name.search.reconnect)
            }).catch((error)=>{
                console.log('重连失败')
                setTimeout(this.reconnect.bind(this),3000)
            })
        }
    }

    setUp() {
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic.bind(this) );
        this.disconnectListener = bleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            ((args) => {
                if(this.current_pillow && this.current_pillow.uuid == args.peripheral) {
                    //TODO 断开时候，要先设置状态，让DeviceView和AdjustView显示重连中

                    this.isLoseConnecting = true
                    NotificationCenter.post(NotificationCenter.name.search.loseConnecting)

                    this.reconnect()
                }
            }).bind(this)
        );
        BleManager.start({showAlert: false})
            .then(() => {
                // Success code
                console.log('Module initialized');
            });
    }

    handleUpdateValueForCharacteristic(data) {
        //TODO 返回值用listener吧，电量的写好了，待测试

        console.log('Received data from ' + data.peripheral + ' text ' + data.text + ' characteristic ' + data.characteristic, data.value);
        var datas = data.value
        var dataStr = util.arrayBufferToBase64Str(datas)
        console.log(dataStr)
        if (this.current_pillow.uuid == data.peripheral) {
            if (datas[0] == 1) {
                NotificationCenter.post(NotificationCenter.name.deviceData.readInsoleData, {point1:datas[1], point2:datas[2], point3:datas[3]})
            } else if (util.startWith(dataStr, "Batt")) {
                var voltage = dataStr.substring(5)
                NotificationCenter.post(NotificationCenter.name.deviceData.voltage, {voltage})
            } else if (util.startWith(dataStr, "M")) {
                var macAddress = dataStr.substring(2)
                NotificationCenter.post(NotificationCenter.name.deviceData.readMacAddress, {macAddress})
            } else if (util.startWith(dataStr, "F:")) {
                NotificationCenter.post(NotificationCenter.name.deviceData.reciveOK)

            }
        }
    }

    static ShareInstance(){
        let singleton = new PillowManager();
        return singleton;
    }

    startTimer(cb) {
        this.loopCallback = cb
        this.loopHandle()
    }

    endTimer (){
        this.loopTimer && cancelAnimationFrame(this.loopTimer);
        this.loopTimer = null;
    }

    loopHandle() {
        var now = new Date().getTime();
        if(now-this.lastUpdateTime>1000*1){
            this.lastUpdateTime = now;
            this.loopCallback()
        }
        this.loopTimer = requestAnimationFrame(this.loopHandle.bind(this));
    }

    //API

    startCheckVoltage() {
        return this.writeData('BR')
    }

    startReadVoltage() {
        return this.writeData('BG')
    }

    startReadMacAddress() {
        return this.writeData('GM')
    }

    startReadInsoleData() {
        return new Promise((resolve, reject) => {
            this.writeData('E')

            resolve()
        });
    }

    stopReadInsoleData() {
        return new Promise((resolve, reject) => {
            this.writeData('D')

            resolve()
        });
    }

    startAdjust() {
        return new Promise((resolve, reject) => {
            this.writeData('PC')

            resolve()
        });
    }

    stopAdjust() {
        return new Promise((resolve, reject) => {
            this.writeData('PS')

            resolve()
        });
    }

    sensorAdjust(index, val) {
        return new Promise((resolve, reject) => {
            var cmd = 'PSP'+index+','+val
            this.writeData(cmd)

            resolve()
        });
    }

    startSearchDevice() {
        return new Promise((resolve, reject) => {
            if (this.isSearching) {
                reject(new Error("已经在搜索中"))
            } else {
                this.lastUpdateTime = new Date().getTime();
                if (Platform.OS === 'android') {
                    BleManager.scan([BleUUIDs.SEARCH_ANDROID_SERVICE_UUID], 0, true).then((results) => {
                        console.log('Scanning...');
                    })
                }

                if (Platform.OS === 'ios') {
                    BleManager.scan([BleUUIDs.SEARCH_IOS_SERVICE_UUID], 3, true).then((results) => {
                        console.log('Scanning...');
                    })
                }
                NotificationCenter.post(NotificationCenter.name.search.startSearch)
                resolve()

                this.startTimer(() => {
                    if (Platform.OS === 'ios') {
                        BleManager.scan([BleUUIDs.SEARCH_IOS_SERVICE_UUID], 3, true).then((results) => {
                            console.log('Scanning...');
                        })
                    }

                    BleManager.getDiscoveredPeripherals([])
                        .then((peripheralsArray) => {
                            var new_list = []

                            var current_list = this.device_list || []
                            if (peripheralsArray ){
                                for (var i = 0; i < peripheralsArray.length; i++) {
                                    var peripheral = peripheralsArray[i]
                                    var isExit = false;
                                    for (var j = 0; j < current_list.length; j++) {
                                        var device = current_list[j]
                                        if(device.uuid == peripheral.id) {
                                            isExit = true
                                            device.rssi = peripheral.rssi
                                            break
                                        }
                                    }
                                    if (!isExit) {
                                        var device = {name:peripheral.name,uuid:peripheral.id, rssi:peripheral.rssi}
                                        new_list.push(device)
                                    }
                                }
                            }

                            this.device_list = [...new_list,...current_list]

                            NotificationCenter.post(NotificationCenter.name.search.updateList, {data:this.device_list})
                        });
                });
            }
        });
    }

    stopSearchDevice() {
        this.isSearching = false
        this.endTimer()
        BleManager.stopScan()
        NotificationCenter.post(NotificationCenter.name.search.stopSearch)
        return true
    }

    startDeviceConnect(device) {
        this.stopSearchDevice()//连接前停止搜索
        this.isLoseConnecting = false
        return new Promise((resolve, reject) => {
            BleManager.connect(device.uuid)
                .then(() => {
                    //这里只是连上，还要notify和write
                    BleManager.retrieveServices(device.uuid)
                        .then((peripheralInfo) => {
                            console.log('Peripheral info:', peripheralInfo);
                            var notifyCharacteristic = null
                            var writeCharacteristic = null
                            if (peripheralInfo.characteristics) {
                                for (var i = 0; i < peripheralInfo.characteristics.length; i++) {
                                    var characteristic = peripheralInfo.characteristics[i]
                                    if (characteristic.characteristic.toUpperCase() == BleUUIDs.PODOON_NOTIFICATION_CHARACTERISTIC_UUID) {
                                        notifyCharacteristic = characteristic.characteristic
                                    } else if (characteristic.characteristic.toUpperCase() == BleUUIDs.PODOON_WRITE_CHARACTERISTIC_UUID) {
                                        writeCharacteristic = characteristic.characteristic
                                    }
                                }
                            }
                            if (notifyCharacteristic && writeCharacteristic) {
                                BleManager.startNotification(device.uuid, BleUUIDs.PODOON_SERVICE_UUID, notifyCharacteristic)
                                    .then(() => {
                                        this.current_pillow = {...device, serviceUUID:BleUUIDs.PODOON_SERVICE_UUID,
                                            noitfyUUID: notifyCharacteristic, writeUUID: writeCharacteristic}
                                        resolve(this.current_pillow)
                                    })
                                    .catch((error) => {
                                        reject(new Error("startNotification失败"+error))
                                    });

                            } else {
                                reject(new Error("鞋垫特征初始化失败"))
                            }
                        });

                })
                .catch((error) => {
                    reject(error)
                });
        });
    }

    deviceDisconnect(uuid) {

        return new Promise((resolve, reject) => {
            if (!this.current_pillow) {
                reject(new Error('无当前设备'))
            } else if(this.isLoseConnecting) {
                resolve(uuid)
                this.isLoseConnecting = false
            } else {
                this.isLoseConnecting = false
                BleManager.disconnect(uuid)
                    .then(() => {
                        resolve(uuid)
                    })
                    .catch((error) => {
                        reject(error)
                    });
            }

        });
    }

    writeData(command) {
        console.log(command)
        const data = stringToBytes(command);
        let current_device = this.current_pillow
        return new Promise((resolve, reject) => {
            if (current_device) {
                BleManager.write(current_device.uuid, current_device.serviceUUID, current_device.writeUUID, data)
                    .then(() => {
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    });
            } else {
                reject(new Error("未连接设备"))
            }
        });
    }

}
