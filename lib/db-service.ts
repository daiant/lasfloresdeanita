import {Pots} from './pots';
import {Flowers} from './flowers';
import {NitroSQLiteConnection, open} from 'react-native-nitro-sqlite';
import {Binnacles} from './binnacle';
import {PotFlowers} from './pot-flowers';

export const database = open({name: 'flowers.sqlite'});

export const createTables = async (db: NitroSQLiteConnection) => {
  Pots.createTable(db);
  Flowers.createTable(db);
  Binnacles.createTable(db);
  PotFlowers.createTable(db);
};
