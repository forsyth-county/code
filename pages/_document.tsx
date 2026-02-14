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
              if (typeof window !== 'undefined') {
                window.define = undefined;
                window.require = undefined;
              }
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
