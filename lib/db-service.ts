import {Pots} from './pots';
import {Flowers} from './flowers';
import {NitroSQLiteConnection, open} from 'react-native-nitro-sqlite';

export const database = open({name: 'flowers.sqlite'});

export const createTables = async (db: NitroSQLiteConnection) => {
  Pots.createTable(db);
  Flowers.createTable(db);
};
