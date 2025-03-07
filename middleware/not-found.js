import NotFoundError from '../errors/not-found.js'

const notFound = (req, res) => {
  const err = new NotFoundError('Route does not exist')
  res.status(err.statusCode).json({ msg: err.message })
}

export default notFound