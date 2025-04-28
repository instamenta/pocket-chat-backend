import { Router } from "express";
import { BaseController } from "./controller.base";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseRouter<T extends BaseController<any>> {
  public readonly router: Router = Router();

  public constructor(controller: T) {
    this.initialize(controller);
  }

  protected abstract initialize(controller: T): void;
}
