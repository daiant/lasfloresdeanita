import {NitroSQLiteConnection} from 'react-native-nitro-sqlite';

const tableName = 'binnacles';
const table = {
  id: 'binnacleId',
  title: 'title',
  description: 'description',
  image: 'image',
  emoji: 'emoji',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt',
};

export type Binnacle = {
  binnacleId: number;
  title: string;
  emoji: string;
  image: string;
  description?: string;
  createdAt: Date;
  deletedAt?: Date;
};
type BinnacleData = Pick<Binnacle, 'title' | 'image' | 'description' | 'emoji'>;

export class Binnacles {
  constructor(readonly db: NitroSQLiteConnection) {}
  create(binnacle: BinnacleData) {
    return this.db.execute(
      `
    INSERT INTO ${tableName} (${table.title}, ${table.description}, ${table.image}, ${table.emoji}) VALUES (?, ?, ?, ?)
  `,
      [binnacle.title, binnacle.description, binnacle.image, binnacle.emoji],
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

  update(binnacleId: Binnacle['binnacleId'], data: BinnacleData) {
    this.db.execute(
      `
      UPDATE 
        ${tableName} 
      SET 
        ${table.title} = ?,
        ${table.description} = ?,
        ${table.image} = ?,
        ${table.emoji} = ?
      WHERE ${table.id} = ? 
      `,
      [data.title, data.description, data.image, data.emoji, binnacleId],
    );
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
    ${table.title} TEXT,
    ${table.description} TEXT,
    ${table.image} TEXT,
    ${table.emoji} TEXT,
    ${table.createdAt} timestamp DEFAULT current_timestamp NOT NULL,
    ${table.deletedAt} timestamp
  );`;

    try {
      db.execute(query);
    } catch (error) {
      console.log(error);
    }
  };
}

const intl = new Intl.DateTimeFormat('es', {day: 'numeric', month: 'long'});
export function formatFromDate(date: Date): string {
  return intl.format(date);
}
export function format(date: string): string {
  return intl.format(dateFromUTC(date, '-'));
}
export function dateFromUTC(dateAsString: any, ymdDelimiter: string) {
  var pattern = new RegExp(
    '(\\d{4})' +
      ymdDelimiter +
      '(\\d{2})' +
      ymdDelimiter +
      '(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})',
  );
  var parts = dateAsString.match(pattern);

  return new Date(
    Date.UTC(
      parseInt(parts[1], 10),
      parseInt(parts[2], 10) - 1,
      parseInt(parts[3], 10),
      parseInt(parts[4], 10),
      parseInt(parts[5], 10),
      parseInt(parts[6], 10),
      0,
    ),
  );
}
