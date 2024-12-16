import {NitroSQLiteConnection} from 'react-native-nitro-sqlite';

const tableName = 'pots';
const table = {
  id: 'potId',
  name: 'name',
  description: 'description',
  deletedAt: 'deletedAt',
};

export type Pot = {
  potId: number;
  name: string;
  description?: string;
  deletedAt?: Date;
};

export class Pots {
  constructor(readonly db: NitroSQLiteConnection) {}
  create(name: string, description: string | undefined) {
    return this.db.execute(
      `
    INSERT INTO ${tableName} (${table.name}, ${table.description}) VALUES (?, ?)
  `,
      [name, description],
    );
  }

  getById(potId: number | string): Pot | undefined {
    const {rows} = this.db.execute<any>(
      `SELECT * FROM ${tableName} WHERE ${table.deletedAt} IS NULL AND ${table.id} = ?;`,
      [potId],
    );
    return rows?._array?.at(0);
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
    ${table.description} TEXT NOT NULL,
    ${table.deletedAt} timestamp
  );`;

    db.execute(query);
  };
}
