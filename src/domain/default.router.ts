import { Router } from 'express'
import { name, version } from '../../package.json';
const DefaultRouter = Router()

DefaultRouter.get('/', (req, res) => {
  return res
    .status(200)
    .send({
      status: 'online',
      application: name,
      version: version
    })
});

export default DefaultRouter