import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import 'express-async-errors'
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
// import connectDB
import connectDB from './db/connect.js'
import authenticateUser from './middleware/authentication.js'
// import routers
import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'

app.use(express.json())
// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)
// error handler
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    // connect to db
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`)
    })
  } catch (error) {
    console.log(error)
  }
})();


