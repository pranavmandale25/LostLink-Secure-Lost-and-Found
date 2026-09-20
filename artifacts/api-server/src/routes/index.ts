import { Router, type IRouter } from "express";
import healthRouter from "./health";
import lostlinkRouter from "./lostlink";

const router: IRouter = Router();

router.use(healthRouter);
router.use(lostlinkRouter);

export default router;
