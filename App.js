import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  PushNotificationIOS,
} from 'react-native';
import firebase from 'react-native-firebase';
import PushNotification from 'react-native-push-notification';

//Hàm này gọi khi ấn vào notification được gửi đến thiết bị
const configOpenNotification = (navigation) =>{
  PushNotification.configure({
    onNotification: function(notification) {
        const { data } = notification; // Dữ liệu do server push lên firebase trả về
        console.log("DT: ",data);
        // sử lý sự kiện navigate sang screen khác ở đây
        console.log("navigation: ", navigation); // vd
    }
  });
}


class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      dataNotification: {},
    }
    /* */
    /* */
    this.temp = 5; //vd
    configOpenNotification(this.temp); //tryền đối tượng this.navigation để router sang screen khác ở đây
    
  }

  componentDidMount(){
    this.createChannel(); 
    this.notificationListener();
    this.getToken();
  }

  // xử lý data nhận được
  setDataNotification = (data) =>{
    this.setState({ dataNotification: data });
    console.log(this.state.dataNotification);
    // do some thing
  }
  ////Hàm thiết lập chanel
  createChannel = () =>{
    const channel = new firebase.notifications.Android.Channel(
      'channelId',
      'channelName',
      firebase.notifications.Android.Importance.Max
    ).setDescription('Description')
    
    firebase.notifications().android.createChannel(channel);
  }
  //Hàm thiết lập Listener khi nhận được notification
  notificationListener = () =>{
    firebase.notifications().onNotification((notification)=>{
      if(Platform.OS == 'android'){
        const localNotification = new firebase.notifications.Notification({
          sound:'default',
          show_in_foreground: true,
        })
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body)
        .setData(notification.data)
        .android.setChannelId('channelId')
        .android.setPriority(firebase.notifications.Android.Priority.High);
        //
        this.setDataNotification(notification.data);

        firebase.notifications().displayNotification(localNotification)
        .catch((err) =>{
          console.log(err);
        })
      }
    });

  }
  //Lấy token của thiết bị, sau đó có thể đẩy lên server lưu vào DB để khi cần push thì gọi lên rồi push đến thiết bị đó qua body của api google firebase
  getToken = async () =>{
    const firebaseToken = await firebase.messaging().getToken();
    console.log("my token:",firebaseToken);
    //// sau đó có thể gọi api lưu vào db
  }


  render(){
    return (
      <View>
        <Text>this is sample txtx</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
});

export default App;
