import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { productsRouter } from "./products.routes.js";
import { categoriesRouter } from "./categories.routes.js";
import { meRouter } from "./me.routes.js";
import { cartRouter } from "./cart.routes.js";
import { ordersRouter } from "./orders.routes.js";
import { adminRouter } from "./admin.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/me", meRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/admin", adminRouter);

