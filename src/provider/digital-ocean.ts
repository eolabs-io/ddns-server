import axios, { AxiosInstance } from 'axios';
import {
  Config,
  DomainRecord,
  DomainRecordPayload,
  Provider,
} from './provider';

export class DigitalOcean extends Provider {
  constructor(config: Config) {
    super(config);
  }

  async getDomainRecord() {
    const url = this.getUrl();
    const params = { name: this.name, type: this.type };
    const response = await this.client.get(url, {
      params,
    });

    const { domain_records } = response.data;
    const domain_record = domain_records[0];

    return domain_record ? (domain_record as DomainRecord) : undefined;
  }

  async createDomainRecord(
    payload: DomainRecordPayload,
  ): Promise<DomainRecord> {
    const url = this.getUrl();
    const response = await this.client.post(url, payload);
    const { domain_record } = response.data;

    return domain_record;
  }

  async updateDomainRecord(
    domainRecordId: number,
    payload: DomainRecordPayload,
  ): Promise<DomainRecord> {
    const url = this.getUrlWithDomainRecordId(domainRecordId);
    const response = await this.client.patch(url, payload);
    const { domain_record } = response.data;

    return domain_record;
  }

  async deleteDomainRecord(domainRecordId: number): Promise<boolean> {
    const url = this.getUrlWithDomainRecordId(domainRecordId);
    const response = await this.client.delete(url);

    const { status } = response;

    return status == 204;
  }

  protected createClient(): AxiosInstance {
    const baseURL = process.env.DO_BASE_URL;
    const token = process.env.DO_DDNS_SERVER_ACCESS_TOKEN;

    return axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private getUrl(): string {
    return `/v2/domains/${this.domainName}/records`;
  }

  private getUrlWithDomainRecordId(id: number): string {
    const url = this.getUrl();
    return `${url}/${id}`;
  }
}
