import { ServiceBroker } from 'moleculer'


import { PayspecInvoice } from '../../../degentx-backend/dbextensions/payspec-extension'

import PrimaryAdapter from './adapter-primary'

export default class PayspecInvoiceModelService extends PrimaryAdapter {
  public constructor(broker: ServiceBroker) {
    super(broker, PayspecInvoice,"payspec_invoice_primary")
  }
}

