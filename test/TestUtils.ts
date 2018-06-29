import {
  readdirSync,
  readFileSync,
} from 'fs';
import { join } from 'path';
import { getConnection } from 'typeorm';

export class TestUtils {
  public static async closeDatabaseConnection() {
    const conn = await getConnection();
    if (conn.isConnected) {
      await conn.close();
    }
  }

  public static async resetDatabase() {
    await this.clearDatabase();
    await this.seedDatabase();
  }

  private static async clearDatabase() {
    try {
      const conn = await getConnection();
      await conn.dropDatabase();
    } catch (error) {
      throw new Error(`An error occurred while clearing the database: ${error}`);
    }
  }

  private static async seedDatabase() {
    try {
      const conn = await getConnection();
      const sqlDirectory = join(__dirname, '../sql');
      const files = readdirSync(sqlDirectory);
      for (const file of files) {
        const sqlQuery = readFileSync(`${sqlDirectory}/${file}`, 'utf8');
        await conn.query(sqlQuery);
      }
    } catch (error) {
      throw new Error(`An error occurred while seeding the database: ${error}`);
    }
  }
}
