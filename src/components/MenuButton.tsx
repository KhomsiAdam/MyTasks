import React from 'react';
import { Button, Icon, IButtonProps, useColorModeValue } from 'native-base';
import { Feather } from '@expo/vector-icons';

interface Props extends IButtonProps {
  active: boolean;
  icon: string;
  children: React.ReactNode;
}

const MenuButton = ({ active, icon, children, ...props }: Props) => {
  return (
    <Button
      size="lg"
      _light={{
        colorScheme: 'blue',
        _pressed: {
          bg: 'blue.50'
        },
        _text: {
          color: active ? 'darkBlue.800' : 'blue.50'
        }
      }}
      _dark={{
        colorScheme: 'darkBlue',
        _pressed: {
          bg: 'darkBlue.800'
        },
        _text: {
          color: active ? 'blue.50' : 'darkBlue.800'
        }
      }}
      bg={active ? useColorModeValue('blue.50', 'darkBlue.800') : 'primary.600'}
      borderWidth={1}
      borderColor={
        !active ? useColorModeValue('blue.50', 'darkBlue.800') : 'transparent'
      }
      variant="solid"
      justifyContent="flex-start"
      leftIcon={
        <Icon
          as={Feather}
          name={icon}
          size="sm"
          color={
            active
              ? useColorModeValue('darkBlue.800', 'blue.50')
              : useColorModeValue('blue.50', 'darkBlue.800')
          }
        />
      }
      {...props}
    >
      {children}
    </Button>
  );
};

export default MenuButton;
