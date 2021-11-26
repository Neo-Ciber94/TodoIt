import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head></Head>
        <body className="bg-orange-200 h-full">
          <Main/>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
