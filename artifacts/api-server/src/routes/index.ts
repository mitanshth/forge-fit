import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import logsRouter from "./logs";
import weightLogsRouter from "./weight-logs";
import dashboardRouter from "./dashboard";
import openaiRouter from "./openai/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(logsRouter);
router.use(weightLogsRouter);
router.use(dashboardRouter);
router.use(openaiRouter);

export default router;
