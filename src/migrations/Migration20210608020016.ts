import { Migration } from '@mikro-orm/migrations';

export class Migration20210608020016 extends Migration {
  async up (): Promise<void> {
    this.addSql('alter table "Presentation" rename column "presentationPresentationRequestUuid" to "presentationPresentationRequestId";');
  }
}
