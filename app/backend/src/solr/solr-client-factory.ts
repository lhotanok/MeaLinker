import { Client, createClient } from 'solr-client';
import { HOST, PORT, SECURE } from './config';

class SolrClientFactory {
  private static coreClients: Record<string, Client> = {};

  public static getClient(core: string): Client {
    if (!this.coreClients[core]) {
      this.coreClients[core] = createClient({
        host: HOST,
        port: PORT,
        core,
        secure: SECURE,
      });
    }

    return this.coreClients[core];
  }
}

export default SolrClientFactory;
