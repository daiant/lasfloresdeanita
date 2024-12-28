import {NitroSQLiteConnection} from 'react-native-nitro-sqlite';
import {Flower} from './flowers';

const tableName = 'pot_flowers';
const table = {
  potId: 'potId',
  flowerId: 'flowerId',
};

export class PotFlowers {
  static delete(db: NitroSQLiteConnection, potId: number, flowerId: number) {
    db.execute(
      `DELETE FROM ${tableName} WHERE ${table.potId} = ? AND ${table.flowerId} = ?`,
      [potId, flowerId],
    );
  }
  static addPotToFlower(
    db: NitroSQLiteConnection,
    potId: number,
    flowerId: Flower['flowerId'],
  ) {
    db.execute(
      `
     INSERT INTO ${tableName} (${table.potId}, ${table.flowerId}) VALUES (?, ?)
      `,
      [potId, flowerId],
    );
  }
  static createTable = (db: NitroSQLiteConnection) => {
    db.execute(`CREATE TABLE IF NOT EXISTS ${tableName} (
      ${table.potId} INTEGER, 
      ${table.flowerId} INTEGER,
      PRIMARY KEY (${table.potId}, ${table.flowerId})
      )`);
  };
}
