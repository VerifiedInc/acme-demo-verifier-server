import { Migration } from '@mikro-orm/migrations';

export class Migration20210604222137 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "PresentationRequest" drop constraint if exists "PresentationRequest_prId_check";');
    this.addSql('alter table "PresentationRequest" alter column "prId" type varchar(255) using ("prId"::varchar(255));');
    this.addSql('alter table "PresentationRequest" alter column "prId" drop not null;');
  }
}
