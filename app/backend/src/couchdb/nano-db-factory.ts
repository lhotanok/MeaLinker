import { PORT, USERNAME, PASSWORD } from './config';
import nanoRoot from 'nano';
import { FullRecipe } from './types/FullRecipe';
import { FullIngredient } from './types/FullIngredient';

const nano = nanoRoot(`http://${USERNAME}:${PASSWORD}@localhost:${PORT}`);

export interface NanoDb extends nanoRoot.DocumentScope<any> {}
export interface RecipeNanoDb extends nanoRoot.DocumentScope<FullRecipe> {}
export interface IngredientNanoDb extends nanoRoot.DocumentScope<FullIngredient> {}

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
