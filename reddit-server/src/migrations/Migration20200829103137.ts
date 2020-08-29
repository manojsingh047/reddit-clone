import { Migration } from '@mikro-orm/migrations';

export class Migration20200829103137 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_name" text not null, "password" text not null, "first_name" text not null, "last_name" text null);');
    this.addSql('alter table "user" add constraint "user_user_name_unique" unique ("user_name");');
  }

}
