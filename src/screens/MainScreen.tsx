import { VStack, useColorModeValue, Fab, Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import AnimatedColorBox from '../components/AnimatedColorBox';
import shortid from 'shortid';
import TaskList from '../components/TaskList';
import MastHead from '../components/MastHead';
import NavBar from '../components/Navbar';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});
interface TaskItemInterface {
  id: string;
  subject: string;
  isDone: boolean;
  date: any;
}

const initialData: Array<TaskItemInterface> = [
  {
    id: shortid.generate(),
    subject: 'Red string: Front end',
    isDone: false,
    date: new Date()
  },
  {
    id: shortid.generate(),
    subject: 'GraphQL express boilerplate',
    isDone: false,
    date: new Date()
  }
];

async function schedulePushNotification(task: any) {
  console.log(task.date);
  const trigger = new Date(task.date);
  // const trigger = new Date('2022-05-14T23:58:41.011Z');
  // const trigger = new Date(Date.now() + 60 * 60);
  console.log(trigger);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Task reminder',
      body: task.subject
    },
    trigger: trigger
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    });
  }

  return token;
}

const MainScreen = () => {
  const [data, setData] = React.useState(initialData);
  const [task, setTask] = React.useState();
  const [dateTime, setDateTime] = useState(new Date());
  // const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [pickerIsVisible, setPickerIsVisible] = React.useState(false);
  const [isScheduled, setIsScheduled] = React.useState(false);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    if (isScheduled) {
      schedulePushNotification(task);
      setIsScheduled(false);
      setDateTime(new Date());
      console.log(data);
    }
  }, [isScheduled]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: any) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        // @ts-ignore
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // const [timePickerIsVisible, setTimePickerIsVisible] = React.useState(false);

  // const datePickerOnChange = (e: any, selectedDate: any) => {
  //   const currentDate = selectedDate || date;
  //   setDatePickerIsVisible(Platform.OS === 'ios');

  // let tempDate = new Date(currentDate);
  // let fDate =
  //   tempDate.getDate() +
  //   '-' +
  //   (tempDate.getMonth() + 1) +
  //   '-' +
  //   tempDate.getFullYear();
  // let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
  // console.log(fDate, fTime);
  // setDate(currentDate);
  // setTime(fTime);
  // };
  // const timePickerOnChange = (e: any, selectedTime: any) => {
  //   const currentTime = selectedTime || time;
  //   setTimePickerIsVisible(Platform.OS === 'ios');
  //   console.log(currentTime);
  //   setTime(currentTime);
  // };

  // const handlePickerVisibility = (currentMode: any) => {
  //   setPickerIsVisible(true);
  //   setMode(currentMode);
  // };

  const onChange = async (event: any, selectedValue: any) => {
    setShow(Platform.OS === 'ios');
    if (mode == 'date') {
      // const currentDate = selectedValue || new Date();
      // setDate(currentDate);
      setMode('time');
      setShow(Platform.OS !== 'ios');
      // console.log('date: ' + currentDate);
    } else {
      const selectedDateTime = selectedValue || new Date();
      setDateTime(selectedDateTime);
      setShow(Platform.OS === 'ios');
      setMode('date');
      const item: any = task!;
      item.date = selectedDateTime;
      setTask(item);
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

  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);

  const handleToggleTaskItem = React.useCallback(item => {
    setData(prevData => {
      const newData = [...prevData];
      const index = prevData.indexOf(item);
      newData[index] = {
        ...item,
        isDone: !item.isDone
      };
      return newData;
    });
  }, []);

  const handleChangeTaskItemSubject = React.useCallback((item, newSubject) => {
    setData(prevData => {
      const newData = [...prevData];
      const index = prevData.indexOf(item);
      newData[index] = {
        ...item,
        subject: newSubject
      };
      return newData;
    });
  }, []);

  const handleFinishEditingTaskItem = React.useCallback(item => {
    setEditingItemId(null);
    // setPickerIsVisible(true);
    showDatepicker();
    // console.log(item);
    setTask(item);
  }, []);

  const handlePressTaskItemLabel = React.useCallback(item => {
    setEditingItemId(item.id);
  }, []);

  const handleRemoveTaskItem = React.useCallback(item => {
    setData(prevData => {
      const newData = prevData.filter(i => i !== item);
      return newData;
    });
  }, []);

  return (
    <AnimatedColorBox
      flex={1}
      bg={useColorModeValue('blue.50', 'darkBlue.800')}
      w="full"
    >
      <MastHead title="Hi" image={require('../../assets/header.webp')}>
        <NavBar />
      </MastHead>
      <VStack
        flex={1}
        space={1}
        bg={useColorModeValue('blue.50', 'darkBlue.800')}
        mt="-20px"
        pt="20px"
        borderTopLeftRadius="20px"
        borderTopRightRadius="20px"
      >
        <TaskList
          data={data}
          editingItemId={editingItemId}
          onToggleItem={handleToggleTaskItem}
          onChangeSubject={handleChangeTaskItemSubject}
          onFinishEditing={handleFinishEditingTaskItem}
          onPressLabel={handlePressTaskItemLabel}
          onRemoveItem={handleRemoveTaskItem}
        />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            // timeZoneOffsetInMinutes={0}
            value={dateTime}
            // @ts-ignore
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        {/* {timePickerIsVisible && (
          <DateTimePicker
            value={date}
            mode={'time'}
            is24Hour={true}
            style={{ width: '80%' }}
            onChange={timePickerOnChange}
          />
        )}
        {datePickerIsVisible && (
          <DateTimePicker
            value={date}
            mode={'date'}
            is24Hour={true}
            style={{ width: '80%' }}
            onChange={datePickerOnChange}
          />
        )} */}
      </VStack>
      <Fab
        position="absolute"
        renderInPortal={false}
        size="sm"
        icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
        colorScheme={useColorModeValue('primary.500', 'primary.400')}
        bg={useColorModeValue('primary.500', 'primary.400')}
        onPress={() => {
          const id = shortid.generate();
          setData([
            {
              id,
              subject: '',
              isDone: false,
              date: ''
            },
            ...data
          ]);
          setEditingItemId(id);
        }}
      />
    </AnimatedColorBox>
  );
};

export default MainScreen;
