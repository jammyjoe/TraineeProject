using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Pokedex.DTOs;
using PokedexAPI.DTOs;
using PokedexAPI.Models;
using PokedexAPI.RepositoryInterface;

namespace Pokedex.Controllers;

[ApiController]
[Route("api/[controller]")]
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public class ImagerController : ControllerBase
{
    private readonly PokedexContext _context;
    private readonly ITypeRepository _typeRepository;
    private readonly IMapper _mapper;

    public ImagerController(PokedexContext context, ITypeRepository typeRepository, IMapper mapper)
    {
        _context = context;
        _typeRepository = typeRepository;
        _mapper = mapper;
    }

    [HttpGet]
    [ProducesResponseType(200)]
    public async Task<ActionResult<PokemonTypeDto>> GetTypes()
    {
        var types = _mapper.Map<List<PokemonTypeDto>>(await _typeRepository.GetTypes());

        if (!ModelState.IsValid)
            return NoContent();

        return Ok(types);
    }

    [HttpGet("{typeName}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]

    public async Task<ActionResult<Type>> GetPokemonsByType(string typeName)
    {
        var pokemons = await _typeRepository.GetPokemonsByType(typeName);

        if (pokemons == null || pokemons.Count == 0)
        {
            return NotFound();
        }

        var pokemonDtos = _mapper.Map<List<PokemonDto>>(pokemons);

        return Ok(pokemonDtos);
    }
}
