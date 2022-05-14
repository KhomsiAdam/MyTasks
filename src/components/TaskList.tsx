import React, { useCallback, useRef } from 'react';
import { AnimatePresence, View } from 'moti';
import {
  PanGestureHandlerProps,
  ScrollView
} from 'react-native-gesture-handler';
import TaskItem from './TaskItem';
import { makeStyledComponent } from '../utils/styled';

const StyledView = makeStyledComponent(View);
const StyledScrollView = makeStyledComponent(ScrollView);

interface TaskItemInterface {
  id: string;
  subject: string;
  isDone: boolean;
  // date: any;
}

interface TaskListProps {
  data: Array<TaskItemInterface>;
  editingItemId: string | null;
  onToggleItem: (item: TaskItemInterface) => void;
  onChangeSubject: (item: TaskItemInterface, newSubject: string) => void;
  onFinishEditing: (item: TaskItemInterface) => void;
  onPressLabel: (item: TaskItemInterface) => void;
  onRemoveItem: (item: TaskItemInterface) => void;
}

interface TaskItemProps
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  data: TaskItemInterface;
  isEditing: boolean;
  onToggleItem: (item: TaskItemInterface) => void;
  onChangeSubject: (item: TaskItemInterface, newSubject: string) => void;
  onFinishEditing: (item: TaskItemInterface) => void;
  onPressLabel: (item: TaskItemInterface) => void;
  onRemove: (item: TaskItemInterface) => void;
}

export const AnimatedTaskItem = (props: TaskItemProps) => {
  const {
    isEditing,
    data,
    onToggleItem,
    onChangeSubject,
    onFinishEditing,
    onPressLabel,
    onRemove,
    simultaneousHandlers
  } = props;
  const handleToggleCheckbox = useCallback(() => {
    onToggleItem(data);
  }, [data, onToggleItem]);
  const handleChangeSubject = useCallback(
    subject => {
      onChangeSubject(data, subject);
    },
    [data, onChangeSubject]
  );
  const handleFinishEditing = useCallback(() => {
    onFinishEditing(data);
  }, [data, onFinishEditing]);
  const handlePressLabel = useCallback(() => {
    onPressLabel(data);
  }, [data, onPressLabel]);
  const handleRemove = useCallback(() => {
    onRemove(data);
  }, [data, onRemove]);
  return (
    <StyledView
      w="full"
      from={{
        opacity: 0,
        scale: 0.5,
        marginBottom: -46
      }}
      animate={{
        opacity: 1,
        scale: 1,
        marginBottom: 0
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        marginBottom: -46
      }}
    >
      <TaskItem
        simultaneousHandlers={simultaneousHandlers}
        // date={data.date}
        subject={data.subject}
        isDone={data.isDone}
        isEditing={isEditing}
        onToggleCheckbox={handleToggleCheckbox}
        onChangeSubject={handleChangeSubject}
        onFinishEditing={handleFinishEditing}
        onPressLabel={handlePressLabel}
        onRemove={handleRemove}
      />
    </StyledView>
  );
};

const TaskList = (props: TaskListProps) => {
  const {
    data,
    editingItemId,
    onToggleItem,
    onChangeSubject,
    onFinishEditing,
    onPressLabel,
    onRemoveItem
  } = props;
  const refScrollView = useRef(null);

  return (
    <StyledScrollView ref={refScrollView} w="full">
      <AnimatePresence>
        {data.map(item => (
          <AnimatedTaskItem
            key={item.id}
            data={item}
            simultaneousHandlers={refScrollView}
            isEditing={item.id === editingItemId}
            onToggleItem={onToggleItem}
            onChangeSubject={onChangeSubject}
            onFinishEditing={onFinishEditing}
            onPressLabel={onPressLabel}
            onRemove={onRemoveItem}
          />
        ))}
      </AnimatePresence>
    </StyledScrollView>
  );
};

export default TaskList;
