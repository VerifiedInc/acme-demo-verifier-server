import { Migration } from '@mikro-orm/migrations';

export class Migration20210526182202 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "PresentationRequest" add column "prId" varchar(255) not null;');
  }
}
