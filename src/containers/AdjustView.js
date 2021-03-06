import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {
    Header,
    Main,
    Footer,
} from '../components/adjust-view';
import Actions from '../actions';
import * as util from "../utils/InsoleUtils";
import StatusBarLeftButton from '../components/common/StatusBarLeftButton'
import Loading from '../components/common/WLoading'

let {height, width} = Dimensions.get('window');

import NotificationCenter from '../public/Com/NotificationCenter/NotificationCenter'

class AdjustView extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title:"鞋垫校准-设置",
            headerLeft: (
                <StatusBarLeftButton onPress={params.backAction} title="返回" ></StatusBarLeftButton>
            ),
        };
    };

    _backAction(){
        this.props.navigation.pop()
    }

    constructor(props){
        super(props);
        this.state = {isVisible: true}
    }
    componentWillMount() {
        this.props.navigation.setParams({ backAction: this._backAction.bind(this) });
    }

    getLoading() {
        return this.refs['loading'];
    }

    sensorAdjust(data) {
        if (data.index) {
            this.props.actions.successSensorAdjust(data.index, data.isSuccess)
        }
    }

    recvACK() {
        //根据当前状态判断是什么操作的接受成功
        if (this.props.device_data.isStopAdjustSUB) {
            this.props.actions.successStopAdjustSUB()
            //返回主界面,断开连接
            this.props.actions.deviceDisconnect(this.props.device_data.uuid)
            this.props.actions.clearDeviceData()
            //延迟点点
            setTimeout(()=>{this.props.navigation.popToTop()},100)
        } else if (this.props.device_data.isStopAdjust) {
            this.props.actions.successStopAdjust()
            this.props.actions.stopAdjustSUB(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
        }
    }

    disconnectHandle(){
        this.getLoading().show('重连中')
    }

    reconnectHandle(){
        this.getLoading().dismiss()
    }

    componentDidMount() {
        this.sensorAdjustListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.sensorAdjust, this.sensorAdjust.bind(this), '');
        this.recvACKListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.recvACK, this.recvACK.bind(this), '');
        this.disconnectListener = NotificationCenter.createListener(NotificationCenter.name.search.loseConnecting, this.disconnectHandle.bind(this), '');
        this.reconnectListener = NotificationCenter.createListener(NotificationCenter.name.search.reconnect, this.reconnectHandle.bind(this), '');
    }
    componentWillUnmount(){
        NotificationCenter.removeListener(this.sensorAdjustListener);
        NotificationCenter.removeListener(this.recvACKListener);
        NotificationCenter.removeListener(this.disconnectListener);
        NotificationCenter.removeListener(this.reconnectListener);
    }
    render() {
        return (
            <View style={styles.container}>
                {/*<Header {...this.props}/>*/}
                <Main {...this.props}/>
                <Footer {...this.props}/>
                <Loading ref={'loading'} text={'重连中...'} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    }
});

function mapStateToProps(state) {
    return {
        device_data: {...state.device, ...state.home}
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdjustView);

