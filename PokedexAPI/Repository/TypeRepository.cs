using PokedexAPI.Models;
using PokedexAPI.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Pokedex.DTOs;
using PokedexAPI.DTOs;

namespace PokedexAPI.Repository;

public class TypeRepository : ITypeRepository
{
    private readonly PokedexContext _context;

    public TypeRepository(PokedexContext context)
    {
        _context = context;
    }

    public async Task<List<PokemonType>> GetTypes()
    {
        return await _context.PokemonTypes.ToListAsync();
    }

    public async Task<List<Pokemon>> GetPokemonsByType(IEnumerable<string> typeNames)
    {
        if (typeNames == null || !typeNames.Any())
        {
            throw new ArgumentException("At least one type name must be provided.", nameof(typeNames));
        }

        var pokemons = await _context.Pokemons
            .Include(p => p.Type1)
            .Include(p => p.Type2)
            .Include(p => p.PokemonStrengths)
            .ThenInclude(ps => ps.Type)
            .Include(p => p.PokemonWeaknesses)
            .ThenInclude(pw => pw.Type)
            .Where(p => typeNames.Contains(p.Type1.TypeName) || typeNames.Contains(p.Type2.TypeName))
            .ToListAsync();

        return pokemons;
    }
}