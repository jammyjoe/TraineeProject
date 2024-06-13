export interface Pokemon {
  id: number;
  name: string;
  type1Id: number;
  type2Id?: number;
  type1: PokemonType;
  type2?: PokemonType;
  pokemonStrengths: PokemonStrength[];
  pokemonWeaknesses: PokemonWeakness[];
}

export interface PokemonType {
  id: number;
  typeName: string;
}

export interface PokemonStrength {
  type: PokemonType;
}

export interface PokemonWeakness {
  type: PokemonType;
}
