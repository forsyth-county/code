import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="CodeForsyth - The most beautiful in-browser Python coding platform" />
        <link rel="icon" type="image/x-icon" href="/code/favicon.ico" />
        <link rel="apple-touch-icon" href="/code/favicon.ico" />
        {/* Suppress AMD module loader errors from Pyodide */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Permanently prevent AMD module loaders from being defined
              // This prevents Pyodide from trying to use AMD loaders
              Object.defineProperty(window, 'define', {
                get: function() { return undefined; },
                set: function() {},
                configurable: false
              });
              Object.defineProperty(window, 'require', {
                get: function() { return undefined; },
                set: function() {},
                configurable: false
              });
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
