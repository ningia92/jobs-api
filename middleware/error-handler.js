import CustomAPIError from '../errors/custom-api.js'
import { StatusCodes } from 'http-status-codes'

const errorHandler = (err, req, res, next) => {
  console.log(err)
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

export default errorHandler