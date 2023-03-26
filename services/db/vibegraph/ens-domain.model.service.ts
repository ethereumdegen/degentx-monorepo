import { ServiceBroker } from 'moleculer'

 
import { EnsDomain } from '../../../dbextensions/vibegraph/ens-domain-vibegraph'  


import VibegraphAdapter from './adapter-vibegraph'

export default class EnsDomainModelService extends VibegraphAdapter {
  public constructor(broker: ServiceBroker) {
    super(broker, EnsDomain,"ens_domain_vibegraph")
  }
}

