import { ServiceBroker } from 'moleculer'

import { EnsDomain } from '../../../dbextensions/ens-domain-extension'

import PrimaryAdapter from './adapter-primary'

export default class EnsDomainModelService extends PrimaryAdapter {
  public constructor(broker: ServiceBroker) {
    super(broker, EnsDomain,"ens_domain_primary")
  }
}

