import React from 'react';
import { Text, HStack, Switch, useColorMode, useColorModeValue } from 'native-base';

const ThemeToggler = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack
      space={1}
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('blue.50', 'darkBlue.800')}
      borderRadius="10px"
      w="full"
    >
      <Text fontWeight={colorMode === 'dark' ? "bold" : "light"}>Dark</Text>
      <Switch
        isChecked={colorMode === 'light'}
        onToggle={toggleColorMode}
        size="lg"
        offTrackColor="primary.500" onTrackColor="primary.500"
      ></Switch>
      <Text fontWeight={colorMode === 'light' ? "bold" : "light"}>Light</Text>
    </HStack>
  );
};

export default ThemeToggler;
