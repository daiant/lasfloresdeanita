import {NitroSQLiteConnection} from 'react-native-nitro-sqlite';

const tableName = 'binnacles';
const table = {
  id: 'binnacleId',
  description: 'description',
  image: 'image',
  emoji: 'emoji',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt',
};

export type Binnacle = {
  binnacleId: number;
  emoji: string;
  image: string;
  description?: string;
  createdAt: Date;
  deletedAt?: Date;
};

export class Binnacles {
  constructor(readonly db: NitroSQLiteConnection) {}
  create(binnacle: Pick<Binnacle, 'image' | 'description' | 'emoji'>) {
    return this.db.execute(
      `
    INSERT INTO ${tableName} (${table.description}, ${table.image}, ${table.emoji}) VALUES (?,?, ?)
  `,
      [binnacle.description, binnacle.image, binnacle.emoji],
    );
  }

  getById(binnacleId: number | string): Binnacle | undefined {
    const {rows} = this.db.execute<any>(
      `SELECT * FROM ${tableName} WHERE ${table.deletedAt} IS NULL AND ${table.id} = ?;`,
      [binnacleId],
    );
    return rows?._array?.at(0);
  }

  get(): Binnacle[] {
    const {rows} = this.db.execute<any>(
      `SELECT * FROM ${tableName} WHERE ${table.deletedAt} IS NULL ORDER BY ${table.id} DESC;`,
    );
    return Array.from(rows?._array ?? []) as Binnacle[];
  }

  delete(binnacleId?: number | string) {
    if (!binnacleId) {
      return;
    }
    this.db.execute(
      `UPDATE ${tableName} SET ${table.deletedAt} = date('now') WHERE ${table.id} = ?`,
      [binnacleId],
    );
  }

  static createTable = (db: NitroSQLiteConnection) => {
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
    ${table.id} INTEGER PRIMARY KEY,
    ${table.description} TEXT NOT NULL,
    ${table.image} TEXT NOT NULL,
    ${table.emoji} TEXT,
    ${table.createdAt} timestamp DEFAULT current_timestamp NOT NULL,
    ${table.deletedAt} timestamp
  );`;

    db.execute(query);
  };
}
