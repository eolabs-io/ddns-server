import { AxiosInstance } from 'axios';
import * as tldts from 'tldts';
import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

export type RecordType =
  | 'A'
  | 'AAAA'
  | 'CAA'
  | 'CNAME'
  | 'MX'
  | 'NS'
  | 'SOA'
  | 'SRV'
  | 'TXT';

export type DomainRecord = {
  id: number;
  type: RecordType;
  name: string;
  data: string;
  priority?: number;
  port?: number;
  ttl: number;
  weight?: number;
  flags?: number;
  tag?: null;
};

export type DomainRecordPayload = Omit<DomainRecord, 'id'>;

export type Config = {
  type?: RecordType;
  name: string;
  ttl?: number;
};

export abstract class Provider {
  protected client: AxiosInstance;
  protected type: RecordType;
  protected name: string;
  protected ttl: number;
  protected domainName: string;
  protected subdomain: string;

  constructor(config: Config) {
    this.type = config.type ?? 'A';
    this.name = config.name;
    this.ttl = config.ttl ?? 30;
    this.domainName = this.getDomainFromName(this.name);
    this.subdomain = this.getSubdomainFromName(this.name);
    this.client = this.createClient();
  }

  abstract getDomainRecord(): Promise<DomainRecord | undefined>;

  abstract createDomainRecord(
    payload: DomainRecordPayload,
  ): Promise<DomainRecord>;

  abstract updateDomainRecord(
    domainRecordId: number,
    payload: DomainRecordPayload,
  ): Promise<DomainRecord>;

  abstract deleteDomainRecord(domainRecordId: number): Promise<boolean>;

  async updateOrCreateRecord(ipAddress: string): Promise<DomainRecord> {
    const record = await this.getDomainRecord();

    const payload = {
      type: this.type,
      name: this.subdomain,
      data: ipAddress,
      ttl: this.ttl,
    };

    if (!record) {
      return this.createDomainRecord(payload);
    } else {
      const { id } = record;
      return this.updateDomainRecord(id, payload);
    }
  }

  private getDomainFromName(record: string): string | null {
    return tldts.getDomain(record);
  }

  private getSubdomainFromName(record: string): string | null {
    return tldts.getSubdomain(record);
  }

  protected abstract createClient(): AxiosInstance;
}
