import fs from "fs";
import path from "path";
import { NextApiResponse } from "next";

/**
 * Represents a handler for an http response.
 */
export abstract class Results {
  /**
   * Creates a response.
   * @param res The response object.
   */
  abstract resolve(res: NextApiResponse): void | Promise<void>;

  /**
   * Creates a `Results` instance from a function.
   * @param fn The function to execute.
   * @returns A result using the given function.
   */
  static fn(fn: (res: NextApiResponse) => any): Results {
    return new (class extends Results {
      resolve(res: NextApiResponse): void | Promise<void> {
        return fn(res);
      }
    })();
  }

  static json(data: any): Results {
    return Results.fn((res) => res.json(data));
  }

  static text(text: string): Results {
    return Results.fn((res) => res.send(text));
  }

  static file(filePath: string, contentType: string): Results {
    return new ResultsWithFile(filePath, contentType);
  }

  static download(
    filePath: string,
    contentType: string,
    filename?: string
  ): Results {
    return new ResultsWithDownload(filePath, contentType, filename);
  }

  static bytes(stream: Buffer): Results {
    return Results.fn((res) => res.write(stream));
  }

  static stream(stream: fs.ReadStream): Results {
    return Results.fn((res) => stream.pipe(res));
  }

  static statusCode(
    statusCode: keyof typeof HTTP_STATUS_CODES,
    message?: string
  ): Results {
    return new ResultsWithStatusCode(statusCode, message);
  }

  static ok(message?: string): Results {
    return ResultsWithStatusCode.create(200, message);
  }

  static accepted(message?: string): Results {
    return ResultsWithStatusCode.create(202, message);
  }

  static noContent(message?: string): Results {
    return ResultsWithStatusCode.create(204, message);
  }

  static created(obj: any, uri: string): Results {
    return new ResultsWithStatusCodeCreated(obj, uri);
  }

  static badRequest(message?: string): Results {
    return ResultsWithStatusCode.create(400, message);
  }

  static unauthorized(message?: string): Results {
    return ResultsWithStatusCode.create(401, message);
  }

  static forbidden(message?: string): Results {
    return ResultsWithStatusCode.create(403, message);
  }

  static notFound(message?: string): Results {
    return ResultsWithStatusCode.create(404, message);
  }

  static internalServerError(message?: string): Results {
    return ResultsWithStatusCode.create(500, message);
  }
}

const HTTP_STATUS_CODES = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  306: "Switch Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Unassigned",
  426: "Upgrade Required",
  427: "Unassigned",
  428: "Precondition Required",
  429: "Too Many Requests",
  430: "Unassigned",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
} as const;

class ResultsWithStatusCode extends Results {
  private static cache = new Map<number, ResultsWithStatusCode>();

  constructor(
    private readonly statusCode: number,
    private readonly message?: string
  ) {
    super();
  }

  static create(statusCode: number, message?: string): ResultsWithStatusCode {
    if (message || !(statusCode in HTTP_STATUS_CODES)) {
      return new ResultsWithStatusCode(statusCode, message);
    }

    let result = ResultsWithStatusCode.cache.get(statusCode);

    if (!result) {
      result = new ResultsWithStatusCode(statusCode);
      ResultsWithStatusCode.cache.set(statusCode, result);
    }

    return result;
  }

  resolve(res: NextApiResponse<any>): void | Promise<void> {
    const message = this.message ?? (HTTP_STATUS_CODES as any)[this.statusCode];

    if (message) {
      return res.status(this.statusCode).send(message);
    }

    return res.status(this.statusCode).send(this.message);
  }
}

class ResultsWithStatusCodeCreated extends Results {
  constructor(private readonly obj: any, private readonly uri: string) {
    super();
  }

  resolve(res: NextApiResponse<any>): void | Promise<void> {
    res.setHeader("Location", this.uri);
    return res.status(201).json(this.obj);
  }
}

class ResultsWithFile extends Results {
  constructor(
    private readonly path: string,
    private readonly contentType: string
  ) {
    super();
  }

  resolve(res: NextApiResponse<any>): void | Promise<void> {
    const filePath = path.join(process.cwd(), this.path);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    res.setHeader("Content-Type", this.contentType);
    res.status(200);
  }
}

class ResultsWithDownload extends Results {
  constructor(
    private readonly path: string,
    private readonly contentType: string,
    private readonly fileName?: string
  ) {
    super();
  }

  resolve(res: NextApiResponse<any>): void | Promise<void> {
    const filePath = path.join(process.cwd(), this.path);
    const fileName = this.fileName ?? path.basename(filePath);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", this.contentType);
    res.status(200);
  }
}
