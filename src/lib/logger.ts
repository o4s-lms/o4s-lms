import { LogLayer, PluginBeforeMessageOutParams } from 'loglayer'
import { PinoTransport } from '@loglayer/transport-pino'
import { serializeError } from 'serialize-error'
import pino from 'pino'

// Create a Pino instance (only needs to be done once)
const pinoLogger = pino({
  level: 'trace' // Set to desired log level
})

const isServer = typeof window === 'undefined'

const log = new LogLayer({
  errorSerializer: serializeError,
  transport: new PinoTransport({
    
    //enabled: isServer, // runs server-side only
    logger: pinoLogger
  }),
  plugins: [
    {
      // Add a plugin to label the log entry as coming from the server or client
      onBeforeMessageOut(params: PluginBeforeMessageOutParams) {
        const tag = isServer ? "Server" : "Client";

        if (params.messages && params.messages.length > 0) {
          if (typeof params.messages[0] === "string") {
            params.messages[0] = `[${tag}] ${params.messages[0]}`;
          }
        }

        return params.messages;
      },
    },
  ]
})

export function getLogger() {
  return log;
}