using PokedexAPI.Models;
using PokedexAPI.Repository;

namespace PokedexAPI.RepositoryInterface;

public interface ITypeRepository
{
    Task<List<PokemonType>> GetTypes();
     Task<List<Pokemon>> GetPokemonsByType(IEnumerable<string> typeName);
}