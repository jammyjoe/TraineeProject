using AutoMapper;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Pokedex.Controllers;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;

[TestFixture]
public class UpdatePokemonTests
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
    public async Task UpdatePokemon_ReturnsNoContent_WhenUpdateIsSuccessful()
    {
        // Arrange
        var pokemonUpdate = A.Fake<PokemonDto>();
        var existingPokemon = new Pokemon { Id = 1, Name = "Pikachu" };

        A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonUpdate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonUpdate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.UpdatePokemon(1, A<PokemonDto>._)).Returns(true);

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        result.Result.Should().BeOfType<NoContentResult>();
    }

    [Test]
    public async Task UpdatePokemon_ReturnsBadRequest_WhenPokemonUpdateIsNull()
    {
        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, null);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("This Id is invalid");
    }

    [Test]
    public async Task UpdatePokemon_ReturnsNotFound_WhenPokemonDoesNotExist()
    {
        // Arrange
        var pokemonUpdate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(false);

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>().Which
            .Value.Should().Be("This pokemon does not exist");
    }

    [Test]
    public async Task UpdatePokemon_ReturnsBadRequest_WhenModelStateIsInvalid()
    {
        // Arrange
        var pokemonUpdate = A.Fake<PokemonDto>();
        _fakePokemonController.ModelState.AddModelError("Name", "Required");

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be(_fakePokemonController.ModelState);
    }

    [Test]
    public async Task UpdatePokemon_ReturnsBadRequest_WhenTypesAreNotDistinct()
    {
        // Arrange
        var pokemonUpdate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonUpdate)).Returns(false);

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("Type 1 and Type 2 can not be the same");
    }

    [Test]
    public async Task UpdatePokemon_ReturnsBadRequest_WhenStrengthsAndWeaknessesAreNotDistinct()
    {
        // Arrange
        var pokemonUpdate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonUpdate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonUpdate)).Returns(false);

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("Strengths and weaknesses cannot have duplicate types.");
    }

    [Test]
    public async Task UpdatePokemon_ReturnsStatusCode500_WhenUpdateFails()
    {
        // Arrange
        var pokemonUpdate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonUpdate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonUpdate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.UpdatePokemon(1, A<PokemonDto>._)).Returns(false);

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        result.Result.Should().BeOfType<ObjectResult>().Which.StatusCode.Should().Be(500);
        ((ObjectResult)result.Result).Value.Should().BeEquivalentTo(_fakePokemonController.ModelState);
    }




}
