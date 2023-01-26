import { App } from "./app/application";
import { RouteInterface } from "app/route.interface";
import userRoute from "./routes/user.route";
import authrRoute from "./routes/auth.route";

console.clear();
const routes: RouteInterface[] = [
    { url: '/user', route: userRoute },
    { url: '/auth', route: authrRoute }
]
const app = new App();
// the order matters
app.configureExternalMiddleware();
app.configureMiddleware();
app.configureRoute(routes);
// Error middleware must be at the end
app.configureErrorMiddleware();
app.setup();
