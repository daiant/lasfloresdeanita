import {NitroSQLiteConnection} from 'react-native-nitro-sqlite';

const tableName = 'pots';
const table = {
  id: 'potId',
  name: 'name',
  deletedAt: 'deletedAt',
};

export type Pot = {
  potId: number;
  name: string;
  deletedAt?: Date;
};

export class Pots {
  constructor(readonly db: NitroSQLiteConnection) {}
  create(name: string) {
    return this.db.execute(
      `
    INSERT INTO ${tableName} (${table.name}) VALUES (?)
  `,
      [name],
    );
  }

  async get(): Promise<Pot[]> {
    return ((
      await this.db.executeAsync(
        `
    SELECT * FROM ${tableName} WHERE ${table.deletedAt} IS NULL ORDER BY ${table.id} DESC;
  `,
      )
    ).rows ?? []) as Pot[];
  }

  static createTable = (db: NitroSQLiteConnection) => {
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
    ${table.id} INTEGER PRIMARY KEY,
    ${table.name} TEXT NOT NULL,
    ${table.deletedAt} timestamp
  );`;

    db.execute(query);
  };
}
