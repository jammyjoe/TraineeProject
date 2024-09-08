using AutoMapper;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using Pokedex.Controllers;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.DTOs;
using PokedexAPI.Models;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

[TestFixture]
public class CreatePokemonTests
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
    public async Task CreatePokemon_ReturnsCreatedAtActionResult_WhenSuccessful()
    {
        // Arrange
        var pokemonCreate = new PokemonDto
        {
            Name = "Pikachu",
            ImageUrl = "http://example.com/image.jpg",
            Details = "Electric type Pokémon.",
            Type1 = new PokemonTypeDto { TypeName = "Electric" },
            Type2 = null,
            PokemonStrengths = new List<PokemonStrengthDto>
            {
                new PokemonStrengthDto { Type = new PokemonTypeDto { TypeName = "Water" } }
            },
            PokemonWeaknesses = new List<PokemonWeaknessDto>
            {
                new PokemonWeaknessDto { Type = new PokemonTypeDto { TypeName = "Ground" } }
            }
        };

        var createdPokemon = new Pokemon
        {
            Id = 1,
            Name = "Pikachu",
            ImageUrl = "http://example.com/image.jpg",
            Details = "Electric type Pokémon.",
            Type1 = new PokemonType { Id = 1, TypeName = "Electric" },
            PokemonStrengths = new List<PokemonStrength>
            {
                new PokemonStrength { Id = 1, Type = new PokemonType { TypeName = "Water" } }
            },
            PokemonWeaknesses = new List<PokemonWeakness>
            {
                new PokemonWeakness { Id = 1, Type = new PokemonType { TypeName = "Ground" } }
            }
        };

        var createdPokemonDto = new PokemonDto
        {
            Id = 1,
            Name = "Pikachu",
            ImageUrl = "http://example.com/image.jpg",
            Details = "Electric type Pokémon.",
            Type1 = new PokemonTypeDto { TypeName = "Electric" },
            PokemonStrengths = new List<PokemonStrengthDto>
            {
                new PokemonStrengthDto { Type = new PokemonTypeDto { TypeName = "Water" } }
            },
            PokemonWeaknesses = new List<PokemonWeaknessDto>
            {
                new PokemonWeaknessDto { Type = new PokemonTypeDto { TypeName = "Ground" } }
            }
        };

        // Arrange FakeItEasy setup
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonCreate.Name)).Returns(false);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonCreate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonCreate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.CreatePokemon(pokemonCreate)).Returns(createdPokemon);
        A.CallTo(() => _fakeMapper.Map<PokemonDto>(createdPokemon)).Returns(createdPokemonDto);

        // Act
        var result = await _fakePokemonController.CreatePokemon(pokemonCreate);

        // Assert
        result.Should().NotBeNull();
        var createdAtActionResult = result.Result as CreatedAtActionResult;

        createdAtActionResult.Should().NotBeNull();
        createdAtActionResult!.Value.Should().BeEquivalentTo(createdPokemonDto);

        // Safely access RouteValues
        createdAtActionResult.RouteValues.Should().ContainKey("name");
        createdAtActionResult.RouteValues?["name"].Should().Be(createdPokemonDto.Name);
    }

    [Test]
    public async Task CreatePokemon_ReturnsBadRequest_WhenModelStateIsInvalid()
    {
        // Arrange
        var pokemonCreate = new PokemonDto
        {
            Name = null, 
            ImageUrl = "http://example.com/image.jpg",
            Details = "Electric type Pokémon.",
            Type1 = new PokemonTypeDto { TypeName = "Electric" },
            Type2 = null,
            PokemonStrengths = new List<PokemonStrengthDto>(),
            PokemonWeaknesses = new List<PokemonWeaknessDto>()
        };

        _fakePokemonController.ModelState.AddModelError("Name", "Name is required.");

        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonCreate.Name)).Returns(false);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonCreate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonCreate)).Returns(true);

        // Act
        var result = await _fakePokemonController.CreatePokemon(pokemonCreate);

        // Assert
        result.Should().NotBeNull();

        var badRequestObjectResult = result.Result as BadRequestObjectResult;
        badRequestObjectResult.Should().NotBeNull();
        badRequestObjectResult?.StatusCode.Should().Be(StatusCodes.Status400BadRequest);

        var serializableError = badRequestObjectResult?.Value as SerializableError;
        serializableError.Should().NotBeNull();
        serializableError.Should().ContainKey("Name");

        var nameErrors = serializableError?["Name"] as IEnumerable<string>;
        nameErrors.Should().NotBeNull();
        nameErrors.Should().Contain("Name is required.");
    }


    [Test]
    public async Task CreatePokemon_ReturnsBadRequest_WhenPokemonAlreadyExists()
    {
        // Arrange
        var pokemonCreate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonCreate.Name)).Returns(true);

        // Act
        var result = await _fakePokemonController.CreatePokemon(pokemonCreate);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("This pokemon already exists");
    }

    [Test]
    public async Task CreatePokemon_ReturnsBadRequest_WhenTypesAreNotDistinct()
    {
        // Arrange
        var pokemonCreate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonCreate)).Returns(false);

        // Act
        var result = await _fakePokemonController.CreatePokemon(pokemonCreate);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("Type 1 and Type 2 can not be the same");
    }

    [Test]
    public async Task CreatePokemon_ReturnsBadRequest_WhenStrengthsAndWeaknessesAreNotDistinct()
    {
        // Arrange
        var pokemonCreate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonCreate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonCreate)).Returns(false);

        // Act
        var result = await _fakePokemonController.CreatePokemon(pokemonCreate);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
        .Value.Should().Be("Strengths and weaknesses cannot have duplicate types.");
    }
}
