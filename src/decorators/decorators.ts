import { NextApiResponse } from "next";
import { NextApiRequestWithParams, ObjectType, Middleware } from ".";
import { getMetadataStorage } from "./metadata";

interface RouteControllerConfig {
  statusCodeOnNull: boolean;
  errors: [];
}

export function RouteController() {
  return function (constructor: ObjectType<any>) {
    getMetadataStorage().addController({
      target: constructor,
    });
  };
}

export function OnError() {
  return function (target: ObjectType<any>, methodName: string) {
    getMetadataStorage().addErrorHandler({
      target: target,
      methodName,
    });
  };
}

export function UseMiddleware<Req, Res>(middleware: Middleware<Req, Res>) {
  return function (target: any, methodName?: string) {
    // If the target is no a method but a class, methodName will be undefined
    if (methodName) {
      getMetadataStorage().addMiddleware({
        target: target.constructor,
        methodName,
        handler: middleware,
      });
    } else {
      getMetadataStorage().addMiddleware({
        target,
        handler: middleware,
      });
    }
  };
}

export function All(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "ALL",
      methodName,
    });
  };
}

export function Get(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "GET",
      methodName,
    });
  };
}

export function Post(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "POST",
      methodName,
    });
  };
}

export function Put(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "PUT",
      methodName,
    });
  };
}

export function Patch(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "PATCH",
      methodName,
    });
  };
}

export function Delete(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "DELETE",
      methodName,
    });
  };
}

export function Head(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "HEAD",
      methodName,
    });
  };
}

export function Options(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "OPTIONS",
      methodName,
    });
  };
}

export function Trace(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "TRACE",
      methodName,
    });
  };
}
