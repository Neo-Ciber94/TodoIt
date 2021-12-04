import morgan from "morgan";
import {
  withController,
  Get,
  NextApiRequestWithParams,
  Post,
  Context,
  HttpContext,
  UseMiddleware,
  RouteController,
} from "src/next-controllers";

@RouteController()
@UseMiddleware(morgan('dev'))
class HelloController {
  @Context({ state: { count: 0 } })
  context!: HttpContext;

  @Get()
  sayHello() {
    return null;
  }

  // @Get("/:name")
  // sayHelloTo() {
  //   return `Hello ${this.context.requestParams.name}!`;
  // }

  @Post("/count")
  count() {
    this.context.state.count += 1;
    return this.context.state;
  }

  @Get("/count")
  getCount() {
    return this.context.state;
  }
}

export default withController(HelloController);
