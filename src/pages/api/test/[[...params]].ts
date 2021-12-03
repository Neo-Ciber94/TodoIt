import morgan from "morgan";
import {
  All,
  Get,
  NextApiRequestWithParams,
  UseMiddleware,
  withController,
} from "src/next-controllers";

abstract class ApiController {
  @Get()
  @UseMiddleware(morgan("dev"))
  sayHello() {
    return "Hello World!";
  }
}

//@UseMiddleware(morgan('dev'))
class HelloController extends ApiController {
  @Get("/:name")
  @UseMiddleware(morgan("dev"))
  sayHelloTo(req: NextApiRequestWithParams) {
    return `Hello ${req.params.name}!`;
  }
}

export default withController(HelloController);
