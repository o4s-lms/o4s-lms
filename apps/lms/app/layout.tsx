import AuthContext from './context/AuthContext'
import ToasterContext from './context/ToasterContext'
import QueryContext from './context/QueryContext'
import './globals.css';

export const metadata = {
  title: 'O4S LMS',
  description: 'Open source Learning Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
				<AuthContext>
          <ToasterContext />
					<QueryContext>
          	{children}
					</QueryContext>
        </AuthContext>
			</body>
    </html>
  )
}
