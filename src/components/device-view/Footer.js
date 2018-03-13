import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Dimensions
} from 'react-native';
import {Theme} from "../../styles";
import * as StorageKeys from "../../constants/StorageKeys";

let {height, width} = Dimensions.get('window');

class Footer extends Component {
    render() {
        return (
            <View style={styles.container}>
            <TouchableHighlight
                activeOpacity={Theme.active.opacity}
                underlayColor='transparent'
                style={{flex:1}}
                onPress={() => this.props.openModal()}>
                <View style={styles.buttonContainer} >
                    <Text style={[this.props.device_data.hadInflateTest&&this.props.device_data.voltage&&
                    (this.props.device_data.fcpMax||this.props.device_data.fcpMax==0)&&this.props.device_data.hadFATTest ?styles.text:styles.textDisable, styles.title]}>
                        完成
                    </Text>
                </View>
            </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center'
    },
    bottom: {

    },
    text: {
        color: '#7ED321'
    },
    textDisable: {
        color: '#777777'
    },
    buttonContainer: {
        position:'absolute',
        top:10,
        bottom:10,
        left:10,
        right:10,
        backgroundColor:'#D8D8D8',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderColor:'#979797',
        borderRadius:4
    },
    title: {
        textAlign: 'center',
        fontSize: 20
    }
});

export default Footer;
