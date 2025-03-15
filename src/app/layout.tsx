import "./../app/styles/index.scss";
import Layout from './components/layout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <title>Apnée France</title>
        {/* <link rel="icon" type="image/x-icon" href="/xxx.ico"></link> */}
      </head>
      <body suppressHydrationWarning>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
