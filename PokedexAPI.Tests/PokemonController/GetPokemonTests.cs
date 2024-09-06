using AutoMapper;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using Pokedex.Controllers;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[TestFixture]
public class GetPokemonTests
{
    private IPokemonRepository _fakePokemonRepository;
    private IMapper _fakeMapper;
    private PokemonController _fakePokemonController;

    [SetUp]
    public void Setup()
    {
        _fakePokemonRepository = A.Fake<IPokemonRepository>();
        _fakeMapper = A.Fake<IMapper>();
        _fakePokemonController = new PokemonController(_fakePokemonRepository, _fakeMapper);
    }

    [Test]
    public async Task GetPokemons_ReturnsOkObjectResult_WhenPokemonsExist()
    {
        // Arrange
        var fakePokemonEntities = new List<Pokemon>
        {
            new Pokemon { Name = "Pikachu" },
            new Pokemon { Name = "Charmander" }
        };
        var fakePokemonDtos = new List<PokemonDto>
        {
            new PokemonDto { Name = "Pikachu" },
            new PokemonDto { Name = "Charmander" }
        };

        A.CallTo(() => _fakePokemonRepository.GetPokemons()).Returns(fakePokemonEntities);
        A.CallTo(() => _fakeMapper.Map<List<PokemonDto>>(fakePokemonEntities)).Returns(fakePokemonDtos);

        // Act
        var result = await _fakePokemonController.GetPokemons();

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult?.Value.Should().BeEquivalentTo(fakePokemonDtos);

        A.CallTo(() => _fakePokemonRepository.GetPokemons()).MustHaveHappenedOnceExactly();
        A.CallTo(() => _fakeMapper.Map<List<PokemonDto>>(fakePokemonEntities)).MustHaveHappenedOnceExactly();
    }

    [Test]
    public async Task GetPokemon_ReturnsOkObjectResult_WhenPokemonExists()
    {
        // Arrange
        var pokemonName = "Pikachu";
        var fakePokemonEntity = new Pokemon { Name = pokemonName };
        var fakePokemonDto = new PokemonDto { Name = pokemonName };

        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonName)).Returns(fakePokemonEntity);
        A.CallTo(() => _fakeMapper.Map<PokemonDto>(fakePokemonEntity)).Returns(fakePokemonDto);

        // Act
        var result = await _fakePokemonController.GetPokemon(pokemonName);

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult?.Value.Should().BeEquivalentTo(fakePokemonDto);
    }

    [Test]
    public async Task GetPokemon_ReturnsNotFound_WhenPokemonDoesNotExist()
    {
        // Arrange
        var pokemonName = "UnknownPokemon";

        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(false);

        // Act
        var result = await _fakePokemonController.GetPokemon(pokemonName);

        // Assert
        result.Should().NotBeNull();
        var notFoundResult = result.Result as NotFoundObjectResult;
        notFoundResult.Should().NotBeNull();
        notFoundResult?.Value.Should().Be("This pokemon does not exist");
    }
}
