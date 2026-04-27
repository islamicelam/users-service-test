import "reflect-metadata";
import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env.config";
import { errorHandler } from "./common/middleware/error-handler.middleware";
import { authRouter } from "./modules/auth/routes/auth.route";
import { userRouter } from "./modules/users/routes/user.route";

async function bootstrap(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");

    const app: Express = express();

    app.use(express.json());

    app.get("/health", (_req: Request, res: Response) => {
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: AppDataSource.isInitialized ? "connected" : "disconnected",
      });
    });

    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);

    app.use(errorHandler);

    app.listen(env.port, () => {
      console.log(`Server is running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

bootstrap();
