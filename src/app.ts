import express, { Application } from 'express';
import { PaymentRoutes } from './routes/paymentRoutes';

class App {
  public app: Application;
  public paymentRoute: PaymentRoutes = new PaymentRoutes();

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.paymentRoute.routes(this.app);
  }
}

export default new App().app;