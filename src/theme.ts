import { extendTheme } from 'native-base';

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light'
};

const colors = {
  primary: {
    50: '#f6fdfb',
    100: '#edfbf6',
    200: '#d1f4e9',
    300: '#b5eddc',
    400: '#7ee0c2',
    500: '#46d2a8',
    600: '#3fbd97',
    700: '#359e7e',
    800: '#2a7e65',
    900: '#226752'
  }
};

export default extendTheme({ config, colors });
