import Header from "./header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main suppressHydrationWarning>{children}</main>
      <footer suppressHydrationWarning></footer>
    </>
  );
}
