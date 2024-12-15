import {NitroSQLiteConnection} from 'react-native-nitro-sqlite';
const tableName = 'flowers';
const table = {
  id: 'flowerId',
  potId: 'potId',
  name: 'name',
  latinName: 'latinName',
  description: 'description',
  floration: 'floration',
  germination: 'germination',
  quantity: 'quantity',
  deletedAt: 'deletedAt',
};

export type Flower = {
  id: number;
  potId: number;
  name: string;
  latinName: string;
  description?: string;
  floration: string;
  germination: string;
  quantity: number;
  deletedAt?: Date;
};
export type FlowerRequest = Pick<
  Flower,
  | 'potId'
  | 'name'
  | 'latinName'
  | 'description'
  | 'germination'
  | 'floration'
  | 'quantity'
>;

export class Flowers {
  constructor(readonly db: NitroSQLiteConnection) {}
  create(flower: FlowerRequest) {
    console.log('Inserting flowereta');
    return this.db.execute(
      `
    INSERT INTO ${tableName} (
      ${table.potId},
      ${table.name},
      ${table.latinName},
      ${table.description},
      ${table.floration},
      ${table.germination},
      ${table.quantity}
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
      [
        flower.potId,
        flower.name,
        flower.latinName,
        flower.description,
        flower.floration,
        flower.germination,
        flower.quantity,
      ],
    );
  }

  get(): Flower[] {
    const {rows} = this.db.execute<any>(
      `SELECT * FROM ${tableName} WHERE ${table.deletedAt} IS NULL ORDER BY ${table.id} DESC;`,
    );

    return Array.from(rows?._array ?? []) as Flower[];
  }

  getByPotId(potId: string): Flower[] {
    const {rows} = this.db.execute<any>(
      `SELECT *
        FROM ${tableName} 
        WHERE 
          ${table.deletedAt} IS NULL 
        AND ${table.potId} = ?
        ORDER BY ${table.id} DESC;`,
      [potId],
    );

    console.log(rows);
    return Array.from(rows?._array ?? []) as Flower[];
  }

  static createTable = async (db: NitroSQLiteConnection) => {
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
    ${table.id} INTEGER PRIMARY KEY,
    ${table.potId} INTEGER,
    ${table.name} TEXT NOT NULL,
    ${table.latinName} TEXT,
    ${table.description} TEXT,
    ${table.floration} TEXT,
    ${table.germination} TEXT,
    ${table.quantity} INTEGER,
    ${table.deletedAt} timestamp
  );`;

    db.execute(query);
  };
}
