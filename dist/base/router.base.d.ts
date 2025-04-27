import { Router } from "express";
import { BaseController } from "./controller.base";
export declare abstract class BaseRouter<T extends BaseController<any>> {
    readonly router: Router;
    constructor(controller: T);
    protected abstract initialize(controller: T): void;
}
//# sourceMappingURL=router.base.d.ts.map