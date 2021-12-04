import morgan from "morgan";
import {
  withController,
  Get,
  Post,
  UseMiddleware,
  RouteController,
  NextApiContext,
} from "src/next-controllers";

type State = {
  count: number;
};

@RouteController<State>({
  state: { count: 0 },
})
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
  count(context: NextApiContext<State>) {
    context.state.count += 1;
    return context.state;
  }

  @Get("/count")
  getCount(context: NextApiContext<State>) {
    console.log(context.state);
    return context.state;
  }
}

export default withController(HelloController);
