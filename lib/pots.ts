import {NitroSQLiteConnection} from 'react-native-nitro-sqlite';
import {Flower, Flowers} from './flowers';

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

  getByFlowerId(flowerId?: Flower['flowerId']): Pot[] {
    if (!flowerId) {
      return [];
    }
    const {rows} = this.db.execute<any>(
      `SELECT * FROM ${tableName} p 
      LEFT JOIN pot_flowers pf ON p.potId = pf.potId
      WHERE 
      pf.flowerId = ? AND
      ${table.deletedAt} IS NULL ORDER BY ${table.id} DESC;`,
      [flowerId],
    );
    return Array.from(rows?._array ?? []) as Pot[];
  }

  update(potId: number, data: {name: string; description: string}) {
    this.db.execute(
      `
      UPDATE ${tableName} SET ${table.name} = ?, ${table.description} = ? WHERE ${table.id} = ? 
      `,
      [data.name, data.description, potId],
    );
  }

  addFlower(potId: number, flowerId: number) {
    Flowers.addPotToFlower(this.db, potId, flowerId);
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
