import { useCallback } from 'react';
import { PanGestureHandlerProps } from 'react-native-gesture-handler';
import {
  NativeSyntheticEvent,
  Pressable,
  TextInputChangeEventData
} from 'react-native';
import {
  Box,
  HStack,
  useTheme,
  themeTools,
  useColorModeValue,
  Icon,
  Input
} from 'native-base';
import AnimatedCheckbox from 'react-native-checkbox-reanimated';
import AnimatedTaskLabel from './AnimatedTaskLabel';
import SwipeableView from './SwipeableView';
import { Feather } from '@expo/vector-icons';

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  isEditing: boolean;
  isDone: boolean;
  onToggleCheckbox?: () => void;
  onPressLabel?: () => void;
  onRemove?: () => void;
  onChangeSubject?: (subject: string) => void;
  onFinishEditing?: () => void;
  subject: string;
}

const TaskItem = (props: Props) => {
  const {
    isEditing,
    isDone,
    onToggleCheckbox,
    subject,
    onPressLabel,
    onRemove,
    onChangeSubject,
    onFinishEditing,
    simultaneousHandlers
  } = props;
  const theme = useTheme();
  const highlightColor = themeTools.getColor(
    theme,
    useColorModeValue('primary.500', 'primary.400')
  );
  const boxStroke = themeTools.getColor(
    theme,
    useColorModeValue('muted.300', 'muted.500')
  );
  const checkMarkColor = themeTools.getColor(
    theme,
    useColorModeValue('white', 'white')
  );
  const activeTextColor = themeTools.getColor(
    theme,
    useColorModeValue('darkText', 'lightText')
  );
  const doneTextColor = themeTools.getColor(
    theme,
    useColorModeValue('muted.400', 'muted.600')
  );

  const handleChangeSubject = useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      onChangeSubject && onChangeSubject(e.nativeEvent.text);
    },
    [onChangeSubject]
  );

  return (
    <SwipeableView
      simultaneousHandlers={simultaneousHandlers}
      onSwipeLeft={onRemove}
      backView={
        <Box
          w="full"
          h="full"
          alignItems="flex-end"
          justifyContent="center"
          pr={4}
          bg="red.500"
        >
          <Icon color="white" as={<Feather name="trash-2" />} />
        </Box>
      }
    >
      <HStack
        alignItems="center"
        w="full"
        px={4}
        py={2}
        bg={useColorModeValue('blue.50', 'darkBlue.800')}
      >
        <Box width={30} height={30} mr={2}>
          <Pressable onPress={onToggleCheckbox}>
            <AnimatedCheckbox
              highlightColor={highlightColor}
              checkmarkColor={checkMarkColor}
              boxOutlineColor={boxStroke}
              checked={isDone}
            />
          </Pressable>
        </Box>
        {isEditing ? (
          <Input
            placeholder="Task"
            value={subject}
            variant="unstyled"
            fontSize={19}
            px={1}
            py={0}
            autoFocus
            blurOnSubmit
            onChange={handleChangeSubject}
            onBlur={onFinishEditing}
          />
        ) : (
          <AnimatedTaskLabel
            textColor={activeTextColor}
            inactiveTextColor={doneTextColor}
            strikeThrough={isDone}
            onPress={onPressLabel}
          >
            {subject}
          </AnimatedTaskLabel>
        )}
      </HStack>
    </SwipeableView>
  );
};
export default TaskItem;
