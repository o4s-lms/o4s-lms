import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface EmailProps {
  message: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : ''

export const OrderStatusMessage = ({
  message = 'Zeno',
}: EmailProps) => (
  <Html>
    <Head />
    <Preview>
      The sales intelligence platform that helps you uncover qualified leads.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/koala-logo.png`}
          width="170"
          height="50"
          alt="Koala"
          style={logo}
        />
        <Text style={paragraph}>Olá,</Text>
        <Text style={paragraph}>
          Welcome to Koala, the sales intelligence platform that helps you
          uncover qualified leads and close deals faster.
        </Text>
				<Text style={paragraph}>
          {message}
        </Text>
        <Section style={btnContainer}>
          <Button pX={12} pY={12} style={button} href="http://joseantcordeiro.hopto.org:4000/app">
            Ver as suas subscrições
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The O4S team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Sobral de Monte Agraço, Portugal</Text>
      </Container>
    </Body>
  </Html>
)

export default OrderStatusMessage

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const logo = {
  margin: '0 auto',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const btnContainer = {
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}