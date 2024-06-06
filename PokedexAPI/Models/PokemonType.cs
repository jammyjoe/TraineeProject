using System;
using System.Collections.Generic;

namespace PokedexAPI.Models
{
    public partial class PokemonType
    {
        public PokemonType()
        {
            PokemonStrengths = new HashSet<PokemonStrength>();
            PokemonWeaknesses = new HashSet<PokemonWeakness>();
            Pokemons = new HashSet<Pokemon>();
        }
        public int Id { get; set; }
        public string? TypeName { get; set; }

        public virtual ICollection<PokemonStrength> PokemonStrengths { get; set; }
        public virtual ICollection<PokemonWeakness> PokemonWeaknesses { get; set; }
        public virtual ICollection<Pokemon> Pokemons { get; set; }
    }
}