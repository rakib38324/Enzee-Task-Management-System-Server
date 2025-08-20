"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routers_1 = __importDefault(require("./app/routers"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:3000", // your Next.js local dev
    "https://enzee-task-management-frontend.vercel.app", // production frontend
];
//--->parser
app.use(express_1.default.json());
// app.use(cors({ origin: '*' }));
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true, // <--- allow cookies/headers
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
//==========>application routes
app.use('/api/v1', routers_1.default);
app.get('/', (req, res) => {
    res.send('Enzee Task Management Server is running successfully.');
});
//========> handle the router not found
app.use(notFound_1.default);
//--> global error
app.use(globalErrorHandler_1.default);
exports.default = app;
