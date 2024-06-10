export interface Pokemon {
  id: number;
  name: string;
  type1: string;
  type2?: string;
  pokemonWeaknesses: Array<{ type: { typeName: string } }>;
  pokemonStrengths: Array<{ type: { typeName: string } }>;
}
