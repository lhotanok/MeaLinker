import { DATABASE_NAME, PORT, USERNAME, PASSWORD } from './config';
import nanoRoot from 'nano';

const nano = nanoRoot(`http://${USERNAME}:${PASSWORD}@localhost:${PORT}`);

export interface NanoDb extends nanoRoot.DocumentScope<unknown> {}

class NanoDbFactory {
  private static database: NanoDb | null;

  private constructor() {}

  public static getDatabase(): NanoDb {
    if (!this.database) {
      this.database = nano.use(DATABASE_NAME);
    }

    return this.database;
  }
}

export default NanoDbFactory;
