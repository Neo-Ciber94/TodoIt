import {
  withController,
  Get,
  NextApiRequestWithParams,
  Results,
} from "src/next-controllers";

class HelloController {
  @Get()
  sayHello() {
    return "Hello World!";
  }

  // @Get("/:name")
  // sayHelloTo(req: NextApiRequestWithParams) {
  //   return `Hello ${req.params.name}!`;
  // }

  @Get("/file")
  getFile() {
    return Results.download("/public/tomato.jpg", "image/jpg", "tmt.jpg");
  }
}

export default withController(HelloController);
