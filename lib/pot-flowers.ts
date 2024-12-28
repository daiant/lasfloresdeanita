import {NitroSQLiteConnection} from 'react-native-nitro-sqlite';

const tableName = 'pot_flowers';
const table = {
  potId: 'potId',
  flowerId: 'flowerId',
};

export class PotFlowers {
  static createTable = (db: NitroSQLiteConnection) => {
    db.execute(`CREATE TABLE IF NOT EXISTS ${tableName} (
      ${table.potId} INTEGER, 
      ${table.flowerId} INTEGER,
      PRIMARY KEY (${table.potId}, ${table.flowerId})
      )`);
  };
}
