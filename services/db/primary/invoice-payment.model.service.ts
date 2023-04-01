import { ServiceBroker } from 'moleculer'

import { InvoicePayment } from '../../../degentx-backend/dbextensions/payspec-extension'

import PrimaryAdapter from './adapter-primary'

export default class InvoicePaymentModelService extends PrimaryAdapter {
  public constructor(broker: ServiceBroker) {
    super(broker, InvoicePayment,"invoice_payment_primary")
  }
}
