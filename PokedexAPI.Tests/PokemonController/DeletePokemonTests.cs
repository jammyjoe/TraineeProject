using AutoMapper;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Pokedex.Controllers;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;

[TestFixture]
public class DeletePokemonTests
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
    public async Task DeletePokemonByName_ReturnsNotFound_WhenPokemonDoesNotExist()
    {
        // Arrange
        var pokemonName = "NonExistentPokemon";
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(false);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonName);

        // Assert
        var notFoundResult = result.Result.Should().BeOfType<NotFoundObjectResult>().Subject;
        notFoundResult.Value.Should().Be("This pokemon does not exist");
    }

    [Test]
    public async Task DeletePokemonByName_ReturnsNoContent_WhenDeletionIsSuccessful()
    {
        // Arrange
        var pokemonName = "Pikachu";
        var pokemonToDelete = new Pokemon { Name = pokemonName };
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonName)).Returns(pokemonToDelete);
        A.CallTo(() => _fakePokemonRepository.DeletePokemon(pokemonToDelete)).Returns(true);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonName);

        // Assert
        result.Result.Should().BeOfType<NoContentResult>();
    }

    [Test]
    public async Task DeletePokemonByName_ReturnsNotFound_WhenDeletionFails()
    {
        // Arrange
        var pokemonName = "Pikachu";
        var pokemonToDelete = new Pokemon { Name = pokemonName };
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonName)).Returns(pokemonToDelete);
        A.CallTo(() => _fakePokemonRepository.DeletePokemon(pokemonToDelete)).Returns(false);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonName);

        // Assert
        var notFoundResult = result.Result.Should().BeOfType<NotFoundObjectResult>().Subject;
        notFoundResult.Value.Should().Be("Deletion failed or the pokemon was not found");
    }


    [Test]
    public async Task DeletePokemonById_ReturnsNotFound_WhenDeletionFails()
    {
        // Arrange
        var pokemonId = 1;
        var pokemonToDelete = new Pokemon { Id = pokemonId };
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonId)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonId)).Returns(pokemonToDelete);
        A.CallTo(() => _fakePokemonRepository.DeletePokemon(pokemonToDelete)).Returns(false);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonId);

        // Assert
        var notFoundResult = result.Result.Should().BeOfType<NotFoundObjectResult>().Subject;
        notFoundResult.Value.Should().Be("Deletion failed or the pokemon was not found"); 
    }

    [Test]
    public async Task DeletePokemonById_ReturnsNoContent_WhenDeletionIsSuccessful()
    {
        // Arrange
        var pokemonId = 1;
        var pokemonToDelete = new Pokemon { Id = pokemonId };
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonId)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonId)).Returns(pokemonToDelete);
        A.CallTo(() => _fakePokemonRepository.DeletePokemon(pokemonToDelete)).Returns(true);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonId);

        // Assert
        result.Result.Should().BeOfType<NoContentResult>();
    }
}
