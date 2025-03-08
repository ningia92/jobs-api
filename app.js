// express app
import express from 'express'
const app = express()
// async errors handler
import 'express-async-errors'
// own middlewares
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/authentication.js'
// connectDB
import connectDB from './db/connect.js'
// routers
import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'
// extra security packages
import helmet from 'helmet'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import { xss } from 'express-xss-sanitizer'
import rateLimit from 'express-rate-limit'
// swagger docs
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
const swaggerDocument = YAML.load('./swagger.yaml')

// If you are behind a proxy/load balancer (usually the case with most hosting services, e.g. Heroku, AWS ELB, Nginx, Cloudflare, etc.), the IP address of the request might be the IP of the load balancer/reverse proxy (making the rate limiter effectively a global one and blocking all requests once the limit is reached) or undefined. To solve:
app.set('trust proxy', 1 /* number of proxies between user and server */)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Too many requests, please try again later.' },
  }))
app.use(express.json())
// Leverage HTTP security headers to enhance the security of your application. Headers like Strict-Transport-Security, X-Content-Type-Options, and X-Frame-Options provide an extra layer of protection against various types of attacks.
app.use(helmet())
app.use(cors())
// data sanitization to cleanse user input and prevent malicious data from reaching your application’s logic.express-mongo-sanitize and xss-clean sanitize data and defend against NoSQL injection and cross-site scripting.
app.use(mongoSanitize())
app.use(xss())

// routes
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    // connect to db
    await connectDB(`${String(process.env.MONGO_URI)}`)
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()


