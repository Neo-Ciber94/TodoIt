import { NextApiResponse } from "next";
import { NextApiRequestWithParams } from "..";

/**
 * Represents the context of a current http request.
 */
export class HttpContext<
  TState extends object = Record<string, any>,
  Req extends NextApiRequestWithParams = NextApiRequestWithParams,
  Res extends NextApiResponse = NextApiResponse
> {
  private readonly _state: TState;
  private readonly _request: Req;
  private readonly _response: Res;

  constructor(state: TState, request: Req, response: Res) {
    this._state = state;
    this._request = request;
    this._response = response;
  }

  /**
   * An state object to share data in the controller.
   */
  get state(): TState {
    return this._state;
  }

  /**
   * The request object.
   */
  get request(): Req {
    return this._request;
  }

  /**
   * The response object.
   */
  get response(): Res {
    return this._response;
  }
}
