using AutoMapper;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Pokedex.Controllers;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;

[TestFixture]
public class GetPokemonTests
{
    private PokedexContext _fakeContext;
    private IPokemonRepository _fakePokemonRepository;
    private IMapper _fakeMapper;
    private PokemonController _fakePokemonController;

    [SetUp]
    public void Setup()
    {
        _fakePokemonRepository = A.Fake<IPokemonRepository>();
        _fakeMapper = A.Fake<IMapper>();
        _fakePokemonController = new PokemonController(_fakeContext, _fakePokemonRepository, _fakeMapper);
    }

    [Test]
    public async Task PokemonController_GetPokemons_ReturnsOkObjectResult()
    {
        // Arrange
        var fakePokemonEntities = A.Fake<ICollection<Pokemon>>();
        var fakePokemonDtos = A.Fake<List<PokemonDto>>();

        A.CallTo(() => _fakePokemonRepository.GetPokemons()).Returns(fakePokemonEntities);
        A.CallTo(() => _fakeMapper.Map<List<PokemonDto>>(fakePokemonEntities)).Returns(fakePokemonDtos);

        // Act
        var result = await _fakePokemonController.GetPokemons();

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<OkObjectResult>()
            .Which.Value.Should().BeSameAs(fakePokemonDtos);

        A.CallTo(() => _fakePokemonRepository.GetPokemons()).MustHaveHappenedOnceExactly();
        A.CallTo(() => _fakeMapper.Map<List<PokemonDto>>(fakePokemonEntities)).MustHaveHappenedOnceExactly();
    }


    [Test]
    public async Task GetPokemon_ReturnsOkObjectResult_WhenPokemonExists()
    {
        // Arrange
        var pokemonName = "ExistingPokemon";
        var fakePokemonEntity = A.Fake<Pokemon>();
        var fakePokemonDto = A.Fake<PokemonDto>();

        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonName)).Returns(fakePokemonEntity);
        A.CallTo(() => _fakeMapper.Map<PokemonDto>(fakePokemonEntity)).Returns(fakePokemonDto);

        // Act
        var result = await _fakePokemonController.GetPokemon(pokemonName);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult.Value.Should().Be(fakePokemonDto);
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
        result.Result.Should().BeOfType<NotFoundObjectResult>();
        var notFoundResult = result.Result as NotFoundObjectResult;
        notFoundResult.Value.Should().Be("This pokemon does not exist");
    }
}
