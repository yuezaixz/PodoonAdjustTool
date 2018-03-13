import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {
    Header,
    Main,
    Footer,
} from '../components/device-view';
import Actions from '../actions';
import StatusBarLeftButton from '../components/common/StatusBarLeftButton'
import Loading from '../components/common/WLoading'
import Modal from 'react-native-simple-modal';

class DeviceView extends Component {
    state = {open: false};
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title:"鞋垫校准",
            headerLeft: (
                <StatusBarLeftButton onPress={params.backAction} title="返回" ></StatusBarLeftButton>
            ),
        };
    };

    handleOk(){
        this.setState({open: false})
        this.getLoading().show()
        this.props.actions.stopReadInsoleData()

        this.props.actions.uploadRecord(
            this.props.device_data.mac_address,
            this.props.device_data.point1Val,
            this.props.device_data.point2Val,
            this.props.device_data.point3Val,
            this.props.device_data.voltage,()=>{
                this.props.actions.startAdjust()
            })


    }
    handleClose() {
        this.setState({open: false})
    }

    getLoading() {
        return this.refs['loading'];
    }

    _backAction(){
        this.props.actions.deviceDisconnect(this.props.device_data.uuid)
        this.props.actions.clearDeviceData()
        setTimeout(()=>{this.props.navigation.pop()},100)
    }

    constructor(props){
        super(props);
    }
    componentWillMount(){
        this.props.navigation.setParams({ backAction: this._backAction.bind(this) });
        this.props.actions.startReadMacAddress()
        //连上后需要发指令就在这把
    }
    componentDidMount(){
        console.log('进入设备页面')
        console.log(this.props)
    }
    render() {
        return (
            <View style={styles.container}>
                <Header {...this.props}/>
                <Main {...this.props} getLoading={this.getLoading.bind(this)} />
                <Footer {...this.props}
                        openModal={()=>{
                            if (this.props.device_data.point1Val&&this.props.device_data.point2Val&&this.props.device_data.point3Val) {
                                this.setState({open:true})}
                            }
                        }
                        getLoading={this.getLoading.bind(this)} />
                <Modal
                    offset={-80}
                    open={this.state.open}
                    modalDidOpen={() => console.log('打开确认写入')}
                    modalDidClose={() => this.handleClose()}
                    style={{alignItems: 'center'}}>
                    <View>
                        <Text style={{fontSize: 20,fontWeight:'bold', marginTop: 10,textAlign:'center'}}>确定写入校准值?</Text>
                        <Text style={{fontSize: 40,fontWeight:'bold', marginTop: 15, marginBottom: 5,textAlign:'center'}}>
                            {this.props.device_data.point1Val},{this.props.device_data.point2Val},{this.props.device_data.point3Val}
                        </Text>
                        <View style={{flexDirection:'row',height:40}}>

                            <TouchableOpacity
                                style={{flex:1,alignItems:'center',justifyContent:'center'}}
                                onPress={() => this.handleOk()}>
                                <Text style={{fontSize: 16,textAlign:'center'}} >确定</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{flex:1,alignItems:'center',justifyContent:'center'}}
                                onPress={() => this.handleClose()}>
                                <Text style={{fontSize: 16,textAlign:'center'}} >取消</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Loading ref={'loading'} text={'测试中...'} />
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
        device_data: {...state.device,
            uuid:state.home.uuid,
            name:state.home.name,
            serviceUUID:state.home.serviceUUID,
            noitfyUUID:state.home.noitfyUUID,
            writeUUID:state.home.writeUUID
        }
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
)(DeviceView);

