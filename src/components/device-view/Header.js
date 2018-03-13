import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Dimensions
} from 'react-native';

let {height, width} = Dimensions.get('window');

class Header extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.text, styles.title]}>
                    MAC：{this.props.device_data.macAddress}
                </Text>
                <Text style={[styles.text, styles.title]}>
                    {(this.props.device_data.done1Val+this.props.device_data.done2Val+this.props.device_data.done3Val)?("该鞋垫已校准"+this.props.device_data.done1Val+","+this.props.device_data.done2Val+","+this.props.device_data.done3Val):"还未校准"}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1.5,
        justifyContent:'center'
    },
    text: {
        color: '#000000'
    },
    title: {
        alignSelf:'center',
        width: width,
        textAlign: 'center',
        fontSize: 20,
    }
});

export default Header;
