export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="import-data-page">
      <h2>Importer des données.</h2>
      {children}
    </div>
  );
}
