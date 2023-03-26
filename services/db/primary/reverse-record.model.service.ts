import { ServiceBroker } from 'moleculer'

import { ReverseRecord } from '../../../dbextensions/reverse-record-extension'

import PrimaryAdapter from './adapter-primary'

export default class ReverseRecordModelService extends PrimaryAdapter {
  public constructor(broker: ServiceBroker) {
    super(broker, ReverseRecord,"reverse_record_primary")
  }
}

