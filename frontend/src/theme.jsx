import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: { 500: '#319795' }, // Teal
    secondary: { 500: '#805AD5' }, // Purple
    accent: { 400: '#ECC94B' }, // Yellow
  },
  components: {
    Button: { baseStyle: { borderRadius: 'lg' } },
    Heading: { baseStyle: { fontWeight: 'bold' } },
  },
});

export default theme;