import * as React from 'react'
import { Html } from '@react-email/html'
import { Button } from '@react-email/button'

interface Props {
	url: string;
}

export function Test({ url }: Props) {

  return (
    <Html lang="en">
      <Button href={url}>Click me</Button>
    </Html>
  )
}
