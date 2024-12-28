/* eslint-disable @typescript-eslint/no-unused-vars */
import {NitroSQLiteConnection} from 'react-native-nitro-sqlite';
import {Pot} from './pots';
import {ToastAndroid} from 'react-native';
const tableName = 'flowers';
const table = {
  id: 'flowerId',
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
  pots: Pot[];
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
  pots: Pot[];
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

  async create(flower: FlowerRequest) {
    await this.db.transaction((tx) => {
      const {rows} = tx.execute(
        `
    INSERT INTO ${tableName} (
      ${table.name},
      ${table.latinName},
      ${table.description},
      ${table.floration},
      ${table.germination},
      ${table.quantity},
      ${table.image}
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING ${table.id}
  `,
        [
          flower.name,
          flower.latinName,
          flower.description,
          flower.floration,
          flower.germination,
          flower.quantity,
          flower.image,
        ],
      );
      const id = rows?.item(0)?.flowerId;
      if (!id) {
        tx.rollback();
        ToastAndroid.show('Algo malo ha pasao :(', ToastAndroid.BOTTOM);
        return;
      }
      flower.pots.forEach(({potId}) => {
        tx.execute('INSERT INTO pot_flowers (flowerId, potId) VALUES (?, ?)', [
          id,
          potId,
        ]);
      });
      tx.commit();
    });
  }

  async update(flower: FlowerRequest) {
    if (!flower.flowerId) {
      return;
    }
    await this.db.transaction((tx) => {
      tx.execute(
        `
    REPLACE INTO ${tableName} (
      ${table.id},
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
          flower.flowerId,
          flower.name,
          flower.latinName,
          flower.description,
          flower.floration,
          flower.germination,
          flower.quantity,
          flower.image,
        ],
      );

      tx.execute('DELETE FROM pot_flowers WHERE flowerId = ?', [
        flower.flowerId,
      ]);

      flower.pots.forEach(({potId}) =>
        tx.execute('INSERT INTO pot_flowers (flowerId, potId) VALUES (?, ?)', [
          flower.flowerId,
          potId,
        ]),
      );

      tx.commit();
    });
  }

  get(): Flower[] {
    const {rows} = this.db.execute<any>(
      `SELECT * FROM ${tableName} WHERE ${table.deletedAt} IS NULL ORDER BY ${table.id} DESC;`,
    );

    return Array.from(rows?._array ?? []) as Flower[];
  }

  getById(flowerId?: Flower['flowerId']): Flower | undefined {
    if (!flowerId) {
      return undefined;
    }

    const {rows} = this.db.execute<any>(
      `SELECT * FROM ${tableName} WHERE ${table.deletedAt} IS NULL AND ${table.id} = ?;`,
      [flowerId],
    );
    return rows?._array?.at(0);
  }

  getByPotId(potId: string): Flower[] {
    const {rows} = this.db.execute<any>(
      `SELECT *
        FROM ${tableName} f
        LEFT JOIN pot_flowers pf ON pf.flowerId = f.${table.id} 
        WHERE 
          pf.potId = ? AND
          ${table.deletedAt} IS NULL 
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
