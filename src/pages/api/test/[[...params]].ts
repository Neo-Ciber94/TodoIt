import { withController, Get, NextApiRequestWithParams } from "src/next-controllers";

class HelloController {
  @Get()
  sayHello() {
    return "Hello World!";
  }

  @Get("/:name")
  sayHelloTo(req: NextApiRequestWithParams) {
    return `Hello ${req.params.name}!`;
  }
}

export default withController(HelloController);
