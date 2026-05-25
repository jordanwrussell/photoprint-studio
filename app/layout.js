import Head from 'next/head';
import '../styles/globals.css';

export const metadata = {
  title: 'PhotoPrint Studio',
  description: 'Upload photos and create custom prints',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
