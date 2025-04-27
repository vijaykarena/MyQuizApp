import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "./ContextApi";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "My Quiz app",
  description: "Created for personal quiz building and practice",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My Quiz App</title>
      </head>

      <body className={poppins.variable}>
        <ContextProvider>
          <main>{children}</main>
          <Toaster
            toastOptions={{
              style: {
                fontSize: "16px",padding: '12px',
              },
            }}
            reverseOrder={false}
          />
        </ContextProvider>
      </body>
    </html>
  );
}
