import { Controller } from 'egg'


export default class HomeController extends Controller {

  index(): void {
    this.ctx.body = 'hi, ' + this.app.plugins.jwt.name
  }

  ping(): void {
    this.ctx.body = 'hi, ' + this.app.plugins.jwt.name
  }

}

