using System.Collections.Generic;
using System.Threading.Tasks;
using Pokedex.DTOs;
using PokedexAPI.Models;

namespace Pokedex.RepositoryInterface
{
    public interface IPokemonRepository
    {
        Task<ICollection<Pokemon>> GetPokemons();
        Task<Pokemon> GetPokemon(int id);
        Task<Pokemon> GetPokemon(string name);
        Task<Pokemon> CreatePokemon(PokemonDto pokemon);
        Task<bool> PokemonTypeExists(string typeName);
        Task<bool> UpdatePokemon(int id, PokemonDto updatedPokemonDto);
        Task<bool> UpdateType(PokemonDto updatePokemonDto, Pokemon existingPokemon);
        Task<bool> PokemonExists(int id);
        Task<bool> PokemonExists(string name);
        Task<bool> DeletePokemon(Pokemon pokemon);
        Task<bool> SavePokemon();
    }
}