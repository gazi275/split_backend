import express, { Application, NextFunction, Request, Response } from "express"

import httpStatus from "http-status"
import cors from "cors"
import cookieParser from "cookie-parser"
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler"
import router from "./app/routes"
import morgan from "morgan"
import config from "./config"

const app: Application = express()

const defaultOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://spliterapp.vercel.app/"
]

const normalizeOrigin = (value: string) => value.trim().replace(/\/$/, "")

const allowedOrigins = Array.from(
  new Set([...defaultOrigins, ...config.frontend_urls].map(normalizeOrigin))
)

const isVercelOrigin = (origin: string) => {
  try {
    const { hostname } = new URL(origin)
    return hostname.endsWith(".vercel.app")
  } catch {
    return false
  }
}

export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow non-browser tools like curl/Postman that may not send an Origin header.
    if (!origin) return callback(null, true)

    const normalizedOrigin = normalizeOrigin(origin)

    if (allowedOrigins.includes(normalizedOrigin) || isVercelOrigin(normalizedOrigin)) {
      return callback(null, true)
    }

    return callback(new Error("CORS origin not allowed"))
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

// Middleware setup
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(morgan("dev")) // Logging middleware

// Route handler for root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    statusCode: httpStatus.OK,
    message: "Welcome to Initial API!",
  })
})

// Router setup
app.use("/api/v1", router)

// Error handling middleware
app.use(GlobalErrorHandler)

// Not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  })
})

export default app
