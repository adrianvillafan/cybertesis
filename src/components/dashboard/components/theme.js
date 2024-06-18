// theme.js
const theme = {
    tokens: {
      colorBackgroundLayoutMain: {
        light: 'white',
        dark: '#333'
      },
      colorTextAccent: {
        light: '#0073bb',
        dark: '#00aaff'
      },
      colorContentLayoutBackground: {
        light: '#333', // color claro
        dark: '#1a1a1a' // color oscuro
      },
      //fontFamilyBase: "'Helvetica Neue', Roboto, Arial, sans-serif",
      //borderRadiusButton: "4px"
    },
    contexts: {
      'top-navigation': {
        tokens: {
          colorTextAccent: '#44b9d6',
        },
      },
    },
  };
  
  export default theme;
  