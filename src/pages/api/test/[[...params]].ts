import morgan from "morgan";
import { All, Get, NextApiRequestWithParams, UseMiddleware, withController } from "src/decorators";

//@UseMiddleware(morgan('dev'))
class HelloController {
  @All()
  sayHello() {
    return "Hello World!";
  }

//   @Get("/:name")
//   @UseMiddleware(morgan('dev'))
//   sayHelloTo(req: NextApiRequestWithParams) {
//     return `Hello ${req.params.name}!`;
//   }
}

export default withController(HelloController);
