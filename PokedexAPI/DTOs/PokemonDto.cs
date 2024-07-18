using System.Collections.Generic;
using PokedexAPI.DTOs;
using PokedexAPI.Models;

namespace Pokedex.DTOs
{
    public record PokemonDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public PokemonTypeDto Type1 { get; set; }
        public PokemonTypeDto Type2 { get; set; }
        public ICollection<PokemonWeaknessDto> PokemonWeaknesses { get; set; }
        public ICollection<PokemonStrengthDto> PokemonStrengths { get; set; }
    }
}