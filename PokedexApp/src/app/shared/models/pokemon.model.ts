export interface Pokemon {
  id: number;
  name: string;
  type1: PokemonType;
  type2?: PokemonType;
  pokemonStrengths: PokemonStrength[];
  pokemonWeaknesses: PokemonWeakness[];
  imageData?: string; // Base64 string of the image
}

export interface PokemonType {
  id: number;
  typeName: string;
}

export interface PokemonStrength {
  id: number;
  pokemonId: number;
  typeId: number;
  type: PokemonType;
}

export interface PokemonWeakness {
  id: number;
  pokemonId: number;
  typeId: number;
  type: PokemonType;
}

