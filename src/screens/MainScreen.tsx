import * as React from 'react';
import { VStack, useColorModeValue, Fab, Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import AnimatedColorBox from '../components/AnimatedColorBox';
import shortid from 'shortid';
import TaskList from '../components/TaskList';
import MastHead from '../components/MastHead';
import NavBar from '../components/Navbar';

interface TaskItemInterface {
  id: string;
  subject: string;
  isDone: boolean;
}

const initialData: Array<TaskItemInterface> = [
  {
    id: shortid.generate(),
    subject: 'Red string: Front end',
    isDone: false
  },
  {
    id: shortid.generate(),
    subject: 'GraphQL express boilerplate',
    isDone: false
  }
];

const MainScreen = () => {
  const [data, setData] = React.useState(initialData);
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
              isDone: false
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
