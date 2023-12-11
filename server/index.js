import { web } from "./config/web/express.js";

web.listen(3001, () => console.log("server ready , http://localhost:3001"));