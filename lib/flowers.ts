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
  image: 'image',
  deletedAt: 'deletedAt',
};

export type Flower = {
  flowerId: number;
  potId: number;
  name: string;
  latinName: string;
  description?: string;
  floration: string;
  germination: string;
  quantity: number;
  image: string;
  deletedAt?: Date;
};

export type FlowerRequest = {
  flowerId: number | undefined;
  potId: number | undefined;
  name: string;
  latinName: string;
  description?: string;
  floration: string;
  germination: string;
  image: string;
  quantity: number;
};

export class Flowers {
  constructor(readonly db: NitroSQLiteConnection) {}
  create(flower: FlowerRequest) {
    return this.db.execute(
      `
    INSERT INTO ${tableName} (
      ${table.potId},
      ${table.name},
      ${table.latinName},
      ${table.description},
      ${table.floration},
      ${table.germination},
      ${table.quantity},
      ${table.image}
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
      [
        flower.potId,
        flower.name,
        flower.latinName,
        flower.description,
        flower.floration,
        flower.germination,
        flower.quantity,
        flower.image,
      ],
    );
  }

  update(flower: FlowerRequest) {
    if (!flower.flowerId) {
      return;
    }

    return this.db.execute(
      `
    REPLACE INTO ${tableName} (
      ${table.id},
      ${table.potId},
      ${table.name},
      ${table.latinName},
      ${table.description},
      ${table.floration},
      ${table.germination},
      ${table.quantity},
      ${table.image}
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
      [
        flower.flowerId,
        flower.potId,
        flower.name,
        flower.latinName,
        flower.description,
        flower.floration,
        flower.germination,
        flower.quantity,
        flower.image,
      ],
    );
  }

  static addPotToFlower(
    db: NitroSQLiteConnection,
    potId: number,
    flowerId: Flower['flowerId'],
  ) {
    db.execute(
      `
     UPDATE ${tableName} SET ${table.potId} = ? WHERE ${table.id} = ? 
      `,
      [potId, flowerId],
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

    return Array.from(rows?._array ?? []) as Flower[];
  }

  delete(flowerId?: number) {
    if (!flowerId) {
      return;
    }
    this.db.execute(
      `UPDATE ${tableName} SET ${table.deletedAt} = date('now') WHERE ${table.id} = ?`,
      [flowerId],
    );
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
    ${table.image} TEXT,
    ${table.deletedAt} timestamp
  );`;

    db.execute(query);
  };
}
