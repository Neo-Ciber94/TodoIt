import { isDevelopment } from "src/client/constants";
import winston, { transports, format } from "winston";
import chalk from "chalk";

// Copied from: winston 'SyslogConfigSetLevels'
// TODO: Use typescript to determine types by removing the indexer
interface LogLevelColors {
  emerg: string;
  alert: string;
  crit: string;
  error: string;
  warning: string;
  notice: string;
  info: string;
  debug: string;
}

function colorize(level: string, message: string): string {
  switch (level as keyof LogLevelColors) {
    case "emerg":
    case "alert":
    case "crit":
    case "error":
      return chalk.red(message);
    case "warning":
    case "notice":
      return chalk.yellow(message);
    case "info":
      return chalk.green(message);
    case "debug":
      return chalk.magenta(message);
    default:
      return message;
  }
}

const logFormat = format.printf(({ level, message, ...rest }) => {
  const now = new Date().toISOString();
  const label = rest.label ? `[${rest.label}] ` : "";
  const info = colorize(level, `${label}[${now}] ${level}`);
  return `${info}: ${message}`;
});

const logger = winston.createLogger({
  level: isDevelopment() ? "debug" : "info",
  format: format.combine(logFormat),
  transports: [new transports.Console()],
});

export default logger;
