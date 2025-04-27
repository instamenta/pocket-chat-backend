import { Router } from "express";
export default abstract class BaseRouter<T> {
    readonly router: Router;
    constructor(controller: T);
    protected abstract initialize(controller: T): void;
}
//# sourceMappingURL=router.base.d.ts.map