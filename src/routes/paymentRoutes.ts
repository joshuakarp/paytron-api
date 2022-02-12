import { Application, Request, Response } from 'express';
import { check, body, validationResult } from 'express-validator';
import { Payment, StoredPayment, StoredPayments } from '../models/paymentModel';
import { PaymentController } from '../controllers/paymentController';
import { createClient } from '../utils/dbUtils';

class PaymentRoutes {
  public paymentController = new PaymentController(createClient());

  public async routes(app: Application): Promise<void> {

    app.route('/')
      .get((req: Request, res: Response) => {
        res.status(200).send({
          message: 'Successful GET',
        });
      });

    app.route('/payments')
      // Submit a payment
      .post(
        body('amount').isInt({ min: 0 }),
        body('beneficiary').isString(),
        body('description').isString(),
        async (req: Request, res: Response) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
          }
          try {
            const payment: Payment = req.body;
            const createdPayment = await this.paymentController.create(payment);
            res.status(201).send(req.body);
          } catch (e) {
            res.status(500).send(e);
          }
        }
      )
      // Retrieve all payments
      .get(async (req: Request, res: Response) => {
        try {
          const payments = await this.paymentController.getAll();
          res.status(200).send(payments);
        } catch (e) {
          res.status(500).send(e);
        }
      });
    
    app.route('/payments/:id')
      // Retrieve a specific payment
      .get(
        async (req: Request, res: Response) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
          }
          const paymentId = parseInt(req.params.id);
          try {
            const payment = await this.paymentController.get(paymentId);
            if (!payment) {
              res.status(404).send(`Payment of ID ${paymentId} does not exist.`);
              return;
            }
            res.status(200).send(payment);
          } catch (e) {
            res.status(500).send(e);
          }
        }
      )
      // Update a specific payment
      .put(
        body('amount').isInt({ min: 0 }),
        body('beneficiary').isString(),
        body('description').isString(),
        async (req: Request, res: Response) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
          }
          const paymentId = parseInt(req.params.id);
          try {
            const updateRequested: Payment = {
              amount: parseInt(req.body.amount),
              beneficiary: req.body.beneficiary,
              description: req.body.description,
            };
            const updated = await this.paymentController.update(
              paymentId,
              updateRequested,
            );
            if (!updated) {
              res.status(404).send(`Payment of ID ${paymentId} does not exist.`);
              return;
            }
            res.status(200).send(updated);
          } catch (e) {
            res.status(500).send(e);
          }
        }
      );
  }
}

export { PaymentRoutes };