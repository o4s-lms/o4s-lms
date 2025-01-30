import { LogLayer, type ILogLayer } from 'loglayer';
import { PinoTransport } from "@loglayer/transport-pino";
import pino from "pino";
import { serializeError } from "serialize-error";
import { Instrumentation } from 'next';
import * as Sentry from "@sentry/nextjs";

/**
 * Strip ANSI codes from a string, which is something Next.js likes to inject.
 */
function stripAnsiCodes(str: string): string {
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    "",
  );
}

/**
 * Create a console method that logs to LogLayer
 */
function createConsoleMethod(log: ILogLayer, method: "error" | "info" | "warn" | "debug" | "log") {
  const mappedMethod = method === "log" ? "info" : method;
  
  return (...args: any[]) => {
    const messages: string[] = [];
    let error: Error | undefined;
    let data: Record<string, any> | undefined;
    
    args.forEach((arg) => {
      if (arg instanceof Error) {
        error = arg;
      } else if (typeof arg === "object" && arg !== null) {
        data = { ...data, ...arg };
      } else if (arg !== undefined && arg !== null) {
        messages.push(String(arg));
      }
    });

    const hasData = data && Object.keys(data).length > 0;

    let finalMessage = stripAnsiCodes(messages.join(" ")).trim();

    // next.js uses an "x" for the error message when it's an error object
    if (finalMessage === "⨯" && error) {
      finalMessage = error?.message || "";
    }

    type LogMethod = keyof Pick<ILogLayer, "error" | "warn" | "info" | "debug">;
    
    if (error && hasData && messages.length > 0) {
      (log.withError(error).withMetadata(data)[mappedMethod as LogMethod])(finalMessage);
    } else if (error && messages.length > 0) {
      (log.withError(error)[mappedMethod as LogMethod])(finalMessage);
    } else if (hasData && messages.length > 0) {
      (log.withMetadata(data)[mappedMethod as LogMethod])(finalMessage);
    } else if (error && hasData && messages.length === 0) {
      (log.withError(error).withMetadata(data)[mappedMethod as LogMethod])("");
    } else if (error && messages.length === 0) {
      log.errorOnly(error);
    } else if (hasData && messages.length === 0) {
      log.metadataOnly(data);
    } else {
      log[mappedMethod as LogMethod](finalMessage);
    }
  };
}

export const onRequestError: Instrumentation.onRequestError = (...args) => {
  Sentry.captureRequestError(...args);

  // ... additional logic here
};

export async function register() {
  const logger = new LogLayer({
    errorSerializer: serializeError,
    transport: [
      new PinoTransport({
        logger: pino(),
      }),
    ]
  })

  //if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../../sentry.server.config");
  //}

  //if (process.env.NEXT_RUNTIME === "edge") {
    //await import("../../sentry.edge.config");
  //}

  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.error = createConsoleMethod(logger, "error");
    console.log = createConsoleMethod(logger, "log");
    console.info = createConsoleMethod(logger, "info");
    console.warn = createConsoleMethod(logger, "warn");
    console.debug = createConsoleMethod(logger, "debug");
  }
}
