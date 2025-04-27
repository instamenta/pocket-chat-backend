import { Router } from "express";
export default class BaseRouter<T> {
    protected router: Router;
    constructor(controller: T);
    protected initialize(c: T): void;
    getRouter(): Router;
}
//# sourceMappingURL=router.base.d.ts.map