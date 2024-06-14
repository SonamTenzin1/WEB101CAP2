import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { mode } from '@chakra-ui/theme-tools';
import App from './App';
import './index.css';

// Define global styles for the application
const styles = {
  global: (props) => ({
    body: {
      bg: mode('gray.100', '#000')(props),
      color: mode('gray.800', 'whiteAlpha.900')(props),
    },
  }),
};

// Configure the color mode for the application
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// Extend the default Chakra UI theme with custom configuration and styles
const theme = extendTheme({ config, styles });

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
