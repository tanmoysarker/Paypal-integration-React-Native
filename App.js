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
import Child from './Child';

class App extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			title:'',
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

	/*---Paypal checkout section---*/
   buyBook = async () => {
	console.log('first check');
    //Check out https://developer.paypal.com/docs/integration/direct/payments/paypal-payments/# for more detail paypal checkout
    const dataDetail = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
			"transactions": [{
        "amount": {
          "currency": "USD",
          "total": "26",
          "details": {
            "shipping": "6",
            "subtotal": "20",
            "shipping_discount": "0",
            "insurance": "0",
            "handling_fee": "0",
            "tax": "0"
          }
							},
        "description": "This is the payment transaction description",
      }],
      "redirect_urls": {
        "return_url": "https://codertig.com",
        "cancel_url": "https://example.com/"
      }
    }

    const url = `https://api.sandbox.paypal.com/v1/oauth2/token`;

    const data = {
      grant_type: 'client_credentials'

    };

    const auth = {
      username: "AbhTP-pngsvcuew0YiT2zxgojxuVJYSRl-vmt_7-Zwpvsnt15slS-AJhqXBrNDtXGlOqLC3FDH3KoTdh",  //"your_paypal-app-client-ID",
      password: "ELDxyxo8z0kciimWfVl0dpC4SCN-PdZ7EusHkonjVL5AjoAVlQu3EN-Ww-Yq7jBT1pq6QLL5o-EgWJz4"   //"your-paypal-app-secret-ID


    };

    const options = {

      method: 'post',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Credentials': true
      },

      //Make sure you use the qs.stringify for data
      data: qs.stringify(data),
      auth: auth,
      url,
    };

    // Authorise with seller app information (clientId and secret key)
    axios(options).then(response => {
			this.setState({setAccessToken: response.data.access_token})

			console.log('response', response);
			console.log('access token', response.data.access_token);
      //Resquest payal payment (It will load login page payment detail on the way)
      axios.post(`https://api.sandbox.paypal.com/v1/payments/payment`, dataDetail,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${response.data.access_token}`
          }
        }
      )
        .then(response => {
          const { id, links } = response.data
          const approvalUrl = links.find(data => data.rel == "approval_url").href
					console.log('payer id',id);
					this.setState({setPayer: response.data.id})
          console.log("response", links)
					this.setState({setPaypalUrl: approvalUrl})
        }).catch(err => {
          console.log({ ...err })
        })
    }).catch(err => {
      console.log(err)
    })
  };

  /*---End Paypal checkout section---*/

  onWebviewLoadStart = () => {
    if (this.state.shouldShowWebViewLoading === true) {
			this.setState({ SetIsWebViewLoading: true });
    }
  }

  _onNavigationStateChange = (webViewState) => {
    console.log("webViewState", webViewState)

    //When the webViewState.title is empty this mean it's in process loading the first paypal page so there is no paypal's loading icon
    //We show our loading icon then. After that we don't want to show our icon we need to set setShouldShowWebviewLoading to limit it
    if (webViewState.title == "") {
      //When the webview get here Don't need our loading anymore because there is one from paypal
			this.setState({setShouldShowWebviewLoading: false})
    }
		console.log('webViewState URL : ',webViewState.url);
		console.log('webViewState URLTest : ',webViewState.url.includes(' https://www.sandbox.paypal.com/cgi-bin/'))

    if (webViewState.url.includes('https://codertig.com/'))  {

			this.setState({setPaypalUrl: null})
			const UrlID = webViewState.url
			// const urlArr = webViewState.url.split(/(=|&)/);
			// console.log('urlArr', urlArr)

			// const payerId = UrlID.substr(UrlID.lastIndexOf('-') + 1)
			const payerId = UrlID.substr(UrlID.lastIndexOf('=') + 1)
			
			const paymentId = payer;
			console.log('payer ID >> : ',payerId)
			console.log('payment ID >>> :',paymentId)
      // const payerId = urlArr[10];

      axios.post(`https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, { payer_id: payerId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
        .then(response => {
					this.setState({setShouldShowWebviewLoading: true})
					console.log('payment response :',response)
					Alert('Your payment has been received');

        }).catch(err => {
					this.setState({setShouldShowWebviewLoading: true});
          console.log({ ...err })
        })

    }
  }

	render() {
  return (
    <React.Fragment>
      <View style={styles.container}>
			 <Child method={this.buyBook}
			   method2 = {this._onNavigationStateChange} 
         url={this.state.setPaypalUrl} 
				 isWebViewLoading= {this.state.isWebViewLoading}
				 method3= {this.onWebviewLoadStart}/>
			 </View>
    </React.Fragment>
	);
			}
};

// App.navigationOptions = {
//   title: 'App',
// };

export default App;

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
