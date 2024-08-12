using System.ComponentModel.DataAnnotations;
using PokedexAPI.DTOs;

namespace Pokedex.DTOs
{
    public record PokemonDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public PokemonTypeDto Type1 { get; set; }
        public PokemonTypeDto Type2 { get; set; }
        public ICollection<PokemonWeaknessDto> PokemonWeaknesses { get; set; }
        public ICollection<PokemonStrengthDto> PokemonStrengths { get; set; }
    }
}