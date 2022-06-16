import { PORT, USERNAME, PASSWORD } from './config';
import nanoRoot from 'nano';
import { FullRecipe } from './types/FullRecipe';

const nano = nanoRoot(`http://${USERNAME}:${PASSWORD}@localhost:${PORT}`);

export interface NanoDb extends nanoRoot.DocumentScope<any> {}
export interface RecipeNanoDb extends nanoRoot.DocumentScope<FullRecipe> {}

class NanoDbFactory {
  private static databases: Record<string, NanoDb> = {};

  public static getDatabase<T>(name: string): NanoDb {
    if (!this.databases[name]) {
      this.databases[name] = nano.use<T>(name);
    }

    return this.databases[name];
  }
}

export default NanoDbFactory;
