import { ServiceBroker } from 'moleculer'

 
import { EnsNameChangedEvent } from '../../../dbextensions/vibegraph/ens_name_changed_event'  

import VibegraphAdapter from './adapter-vibegraph'

export default class EnsNameChangedEventModelService extends VibegraphAdapter {
  public constructor(broker: ServiceBroker) {
    super(broker, EnsNameChangedEvent,"name_changed_vibegraph")
  }
}

