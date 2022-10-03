import * as React from "react"
import "../styles/globals.css"
import { ChakraProvider, StylesProvider, useTheme } from "@chakra-ui/react"

function MyApp({ Component, pageProps }) {
  // const styles = useStyles()
  const theme = useTheme()
  return (
    <StylesProvider value={theme}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </StylesProvider>
  )
}

export default MyApp
