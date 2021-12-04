import morgan from "morgan";
import {
  withController,
  Get,
  NextApiRequestWithParams,
  Post,
  Context,
  HttpContext,
  UseMiddleware,
} from "src/next-controllers";

@UseMiddleware(morgan('dev'))
class HelloController {
  @Context({ state: { count: 0 } })
  context!: HttpContext;

  @Get()
  sayHello() {
    return "Hello World!";
  }

  // @Get("/:name")
  // sayHelloTo(req: NextApiRequestWithParams) {
  //   return `Hello ${req.params.name}!`;
  // }

  @Post("/count")
  count(req: NextApiRequestWithParams) {
    this.context.state.count += 1;
    return this.context.state;
  }

  @Get("/count")
  getCount() {
    return this.context.state;
  }
}

export default withController(HelloController);
