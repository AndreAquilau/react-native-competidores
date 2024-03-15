import SQLite from 'react-native-sqlite-storage';
import Competidor from '../interfaces/competidor-interface';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

export const getDbConnection = async () => {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabase({
    name: 'competitor.db',
    location: 'default',
  });
  
  // create table if it does not exist yet
  db.executeSql(`
    CREATE TABLE IF NOT EXISTS COMPETITOR
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      primeiroNome TEXT,
      segundoNome TEXT,
      email TEXT,
      cep TEXT,
      logradouro TEXT,
      numero TEXT,
      bairro TEXT,
      localidade TEXT,
      uf TEXT
    );
  `);

  return db;
};


export const addCompetidor = async (competidor: Omit<Competidor, 'id'>) => {
  const db = await getDbConnection();
  
  return db.executeSql(
    'INSERT INTO COMPETITOR (primeiroNome, segundoNome, email, cep, logradouro, numero, bairro, localidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [competidor.primeiroNome, 
     competidor.segundoNome, 
     competidor.email,
     competidor.cep, 
     competidor.logradouro, 
     competidor.numero, 
     competidor.bairro,
     competidor.localidade,
     competidor.uf]);
};

export const getCompetidores = async () => {
  const db = await getDbConnection();
  const [results] = await db.executeSql('SELECT * FROM COMPETITOR');
  
  return results.rows.raw() as Competidor[];
};

export const getCompetidorByName = async (primeiroNome: string) => {
  const db = await getDbConnection();
  const [results] = await db.executeSql('SELECT * FROM COMPETITOR WHERE primeiroNome = ?', [primeiroNome]);
  
  return results.rows.raw() as Competidor[];
}

export const getCompetidorById = async (id: number) => {
  const db = await getDbConnection();
  const [results] = await db.executeSql('SELECT * FROM COMPETITOR WHERE id = ?', [id]);
  
  return results.rows.raw() as Competidor[];
}

export const updateCompetidor = async (id: number, competidor: Partial<Competidor>) => {
  const db = await getDbConnection();
  const paramNames = Object.keys(competidor).join(" = ?,") + " = ?";
  const paramValues = Object.values(competidor);
  return db.executeSql(`UPDATE COMPETITOR SET ${paramNames} WHERE id = ?`, [...paramValues, id]);
};