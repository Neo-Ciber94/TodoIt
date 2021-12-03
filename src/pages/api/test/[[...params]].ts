import { Get, NextApiRequestWithParams, withController } from "src/decorators";

class HelloController {
  @Get()
  sayHello(req: NextApiRequestWithParams) {
    return "Hello World!";
  }

  @Get("/:name")
  sayHelloTo(req: NextApiRequestWithParams) {
    return `Hello ${req.params.name}!`;
  }
}

export default withController(HelloController);
