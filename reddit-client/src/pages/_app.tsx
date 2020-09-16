import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import theme from '../theme'
import { createClient, Provider } from 'urql';

function MyApp({ Component, pageProps }) {
  const client = createClient({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include'
    }
  });
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
