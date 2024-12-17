import {Pots} from './pots';
import {Flowers} from './flowers';
import {NitroSQLiteConnection, open} from 'react-native-nitro-sqlite';
import {Binnacles} from './binnacle';

export const database = open({name: 'flowers.sqlite'});

export const createTables = async (db: NitroSQLiteConnection) => {
  Pots.createTable(db);
  Flowers.createTable(db);
  Binnacles.createTable(db);
};
