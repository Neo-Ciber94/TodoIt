import { isDevelopment } from "src/client/constants";
import winston, { transports, format } from "winston";

const logger = winston.createLogger({
  level: isDevelopment() ? "DEBUG" : "INFO",
  format: format.combine(
    format.timestamp(),
    format.simple(),
    format.colorize()
  ),
  transports: [new transports.Console()],
});

export default logger;
