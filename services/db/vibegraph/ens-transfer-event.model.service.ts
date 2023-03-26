import { ServiceBroker } from 'moleculer'

 
import { EnsTransferEvent } from '../../../dbextensions/vibegraph/ens_transfer_event'  

import VibegraphAdapter from './adapter-vibegraph'

export default class EnsTransferEventModelService extends VibegraphAdapter {
  public constructor(broker: ServiceBroker) {
    super(broker, EnsTransferEvent,"ens_transfer_vibegraph")
  }
}

