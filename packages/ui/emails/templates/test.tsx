import * as React from 'react'
import { Html, Button } from '@react-email/components'

interface EmailProps {
	url: string;
}

export const Test: React.FC<Readonly<EmailProps>> = ({ url }) => {

  return (
    <Html lang="en">
      <Button href={url}>Click me</Button>
    </Html>
  )
}
