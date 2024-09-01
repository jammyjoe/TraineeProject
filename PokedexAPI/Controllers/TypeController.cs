using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Pokedex.DTOs;
using PokedexAPI.DTOs;
using PokedexAPI.Models;
using PokedexAPI.RepositoryInterface;

namespace Pokedex.Controllers;

[Authorize]
[ApiController]
[RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")]
[Route("api/[controller]")]
[EnableCors("AllowedOriginsPolicy")]
public class TypeController : ControllerBase
{
    private readonly PokedexContext _context;
    private readonly ITypeRepository _typeRepository;
    private readonly IMapper _mapper;

    public TypeController(PokedexContext context, ITypeRepository typeRepository, IMapper mapper)
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

internal class RequiredScopeAttribute : Attribute
{
    public string RequiredScopesConfigurationKey { get; set; }
}