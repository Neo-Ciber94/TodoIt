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

@RouteController({ state: { count: 0 } })
@UseMiddleware(morgan("dev"))
class HelloController {
  @Get()
  sayHello() {
    return "Hello World!";
  }

  // @Get("/:name")
  // sayHelloTo() {
  //   return `Hello ${this.context.requestParams.name}!`;
  // }

  @Post("/count")
  count(context: HttpContext) {
    context.state.count += 1;
    return context.state;
  }

  @Get("/count")
  getCount(context: HttpContext) {
    console.log(context.state)
    return context.state;
  }
}

export default withController(HelloController);
