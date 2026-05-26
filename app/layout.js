import './globals.css'

export const metadata = {
  title: 'PhotoMagnet Pro',
  description: 'Photo printing SaaS platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
