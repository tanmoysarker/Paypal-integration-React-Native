import React, { PureComponent,useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
	Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import axios from "axios";
import qs from "qs";
//import { decode, encode } from 'base-64'

class Child extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			isWebViewLoading : false,
			SetIsWebViewLoading : false,
			paypalUrl : '',
			setPaypalUrl : '',
			accessToken : '',
			setAccessToken : '',
			payer : '',
			setPayer : '',
			shouldShowWebViewLoading : true,
			setShouldShowWebviewLoading : true
		};
}

	render() {
		console.log('foreplay started',this.props)
  return (
    <View>
      <View style={styles.container}>
        <Text>Paypal in React Native</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.props.method}
          style={
            styles.btn
          }>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '400',
              textAlign: 'center',
              color: '#ffffff',
            }}>
            BUY NOW
                      </Text>
        </TouchableOpacity>
      </View>
      {this.props.url ? (
        <View style={styles.webview}>
          <WebView
            style={{ height: "100%", width: "100%" }}
            source={{ uri: this.props.setPaypalUrl }}
            onNavigationStateChange={this.props.method2}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            onLoadStart={this.props.method3}
            // onLoadEnd={() => this.props.SetIsWebViewLoading(false)}
          />
        </View>
      ) : null}
      {this.props.isWebViewLoading ? (
        <View style={{ ...StyleSheet.absoluteFill, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" }}>
          <ActivityIndicator size="small" color="#A02AE0" />
        </View>
      ) : null}
    </View>
	);
			}
};

export default Child;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center"
  },
  webview: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  btn: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#61E786',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
