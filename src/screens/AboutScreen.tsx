import React, { useEffect, useState } from 'react';

import { Text, View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import shortid from 'shortid';
import moment from 'moment';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

const AboutScreen = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  // const oldDateObj = new Date();
  // const newDateObj = moment(oldDateObj).add(1, 'm').add(1, 'h').toDate();

  // const task = {
  //   id: shortid.generate(),
  //   subject: 'Red string: Front end',
  //   isDone: false,
  //   date: new Date(newDateObj),
  // };

  // console.log(task);

  // const scheduler = async () => {
  //   if (isScheduled) await scheduleTask(task);
  // };

  // useEffect(() => {
  //   // scheduler();
  //   scheduleTask(task)
  // }, []);

  const onChange = async (event: any, selectedValue: any) => {
    setShow(Platform.OS === 'ios');
    if (mode == 'date') {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
      setMode('time');
      setShow(Platform.OS !== 'ios');
    } else {
      const selectedTime = selectedValue || new Date();
      setTime(selectedTime);
      setShow(Platform.OS === 'ios');
      setMode('date');
      setIsScheduled(true);
      
    }
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  // const scheduleTask = async (task: any) => {
  //   const trigger = new Date(task.date);
  //   try {
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: 'Task',
  //         body: task.subject
  //       },
  //       trigger
  //     });
  //     console.log('hi');
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <View style={{ marginTop: 100 }}>
      <TouchableOpacity onPress={showDatepicker}>
        <Text style={{ fontSize: 50 }}>{formatDate(date, time)}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          // timeZoneOffsetInMinutes={0}
          value={date}
          // @ts-ignore
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const formatDate = (date: any, time: any) => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${time.getHours()}:${time.getMinutes()}`;
};

export default AboutScreen;
// @ts-nocheck
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import moment from 'moment';
// import React, { useState, useEffect, useRef } from 'react';
// import { Text, View, Button, Platform } from 'react-native';
// import shortid from 'shortid';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true
//   })
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//     notificationListener.current =
//       Notifications.addNotificationReceivedListener(notification => {
//         setNotification(notification);
//       });

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener(response => {
//         console.log(response);
//       });

//     return () => {
//       Notifications.removeNotificationSubscription(
//         notificationListener.current
//       );
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'space-around'
//       }}
//     >
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text>
//           Title: {notification && notification.request.content.title}{' '}
//         </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>
//           Data:{' '}
//           {notification && JSON.stringify(notification.request.content.data)}
//         </Text>
//       </View>
//       <Button
//         title="Press to schedule a notification"
//         onPress={async () => {
//           await schedulePushNotification();
//         }}
//       />
//     </View>
//   );
// }

// const oldDateObj = new Date();
// const newDateObj = moment(oldDateObj).add(1, 'm').toDate();

// const task = {
//   id: shortid.generate(),
//   subject: 'Red string: Front end',
//   isDone: false,
//   date: new Date(newDateObj)
// };
// console.log(task);

// async function schedulePushNotification() {
//   const trigger = new Date(task.date);
//   // const trigger = new Date(Date.now() + 60 * 60);
//   console.log(trigger);
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: 'Task',
//       body: 'testing'
//     },
//     trigger: trigger
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C'
//     });
//   }

//   return token;
// }
