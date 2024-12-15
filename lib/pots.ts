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

  get(): Pot[] {
    const {rows} = this.db.execute<any>(
      `SELECT * FROM ${tableName} WHERE ${table.deletedAt} IS NULL ORDER BY ${table.id} DESC;`,
    );
    return Array.from(rows?._array ?? []) as Pot[];
  }

  delete(potId?: number | string) {
    if (!potId) {
      return;
    }
    this.db.execute(
      `UPDATE ${tableName} SET ${table.deletedAt} = date('now') WHERE ${table.id} = ?`,
      [potId],
    );
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
