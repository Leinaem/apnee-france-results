import "./globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <title>Apnée France</title>
        {/* <link rel="icon" type="image/x-icon" href="/xxx.ico"></link> */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
