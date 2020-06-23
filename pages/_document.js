import Document, {Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'
import GlobalStyles from '../styles/global'

export default class MyDocument extends Document {

    static getInitialProps({renderPage}) {
        const sheet = new ServerStyleSheet()
        const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
        const styleTags = sheet.getStyleElement()
        return {...page, styleTags}
    }

    render = () => (
        <html lang="en">
        <Head>
            <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>

            <meta key="viewport" name="viewport" content="initial-scale=1, minimum-scale=1, width=device-width"/>
            <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@1,200&family=PT+Sans&display=swap"
                  rel="stylesheet" />

            <meta name="msapplication-TileColor" content="#000000"/>
            <meta name="theme-color" content="#000000"/>

            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#fff"/>
            <meta name="msapplication-TileColor" content="#da532c"/>
            <meta name="theme-color" content="#ffffff"/>

            <GlobalStyles/>
                {this.props.styleTags}
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
        </html>
)
}