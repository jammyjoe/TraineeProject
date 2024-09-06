using NUnit.Framework;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Pokedex.Controllers;
using PokedexAPI.Models;
using PokedexAPI.RepositoryInterface;
using AutoMapper;
using Pokedex.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using PokedexAPI.DTOs;

[TestFixture]
public class TypeControllerTests
{
    private ITypeRepository _fakeTypeRepository;
    private IMapper _fakeMapper;
    private TypeController _faketypeController;

    [SetUp]
    public void SetUp()
    {
        _fakeTypeRepository = A.Fake<ITypeRepository>();
        _fakeMapper = A.Fake<IMapper>();
        _faketypeController = new TypeController(_fakeTypeRepository, _fakeMapper);
    }

    [Test]
    public async Task GetTypes_ShouldReturnOkResult_WithListOfTypes()
    {
        // Arrange
        var fakeTypes = new List<PokemonType> 
        { 
            new PokemonType { Id = 1, TypeName = "Fire" }, 
            new PokemonType { Id = 2, TypeName = "Water" } 
        };
        
        var typeDtos = new List<PokemonTypeDto> 
        { 
            new PokemonTypeDto { Id = 1, TypeName = "Fire" }, 
            new PokemonTypeDto { Id = 2, TypeName = "Water" } 
        };

        A.CallTo(() => _fakeTypeRepository.GetTypes()).Returns(fakeTypes);
        A.CallTo(() => _fakeMapper.Map<List<PokemonTypeDto>>(fakeTypes)).Returns(typeDtos);

        // Act
        var result = await _faketypeController.GetTypes();

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();

        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult?.StatusCode.Should().Be(200);
        okResult?.Value.Should().BeEquivalentTo(typeDtos);
    }

    [Test]
    public async Task GetPokemonsByTypes_ShouldReturnOk_WhenValidTypeNamesAreGiven()
    {
        // Arrange
        var typeNames = new List<string> { "Fire", "Water" };
        var fakePokemons = new List<Pokemon>
        {
            new Pokemon { Id = 1, Name = "Charmander", Type1 = new PokemonType { TypeName = "Fire" } },
            new Pokemon { Id = 2, Name = "Squirtle", Type1 = new PokemonType { TypeName = "Water" } }
        };
        var fakePokemonDtos = new List<PokemonDto>
        {
            new PokemonDto { Id = 1, Name = "Charmander" },
            new PokemonDto { Id = 2, Name = "Squirtle" }
        };

        A.CallTo(() => _fakeTypeRepository.GetPokemonsByType(typeNames)).Returns(fakePokemons);
        A.CallTo(() => _fakeMapper.Map<List<PokemonDto>>(fakePokemons)).Returns(fakePokemonDtos);

        // Act
        var result = await _faketypeController.GetPokemonsByTypes(typeNames);

        // Assert
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult?.StatusCode.Should().Be(200);
        okResult?.Value.Should().BeEquivalentTo(fakePokemonDtos);
    }

    [Test]
    public async Task GetPokemonsByTypes_ShouldReturnBadRequest_WhenTypeNamesAreEmpty()
    {
        // Act
        var result = await _faketypeController.GetPokemonsByTypes(new List<string>());

        // Assert
        var badRequestResult = result.Result as BadRequestObjectResult;
        badRequestResult.Should().NotBeNull();
        badRequestResult?.StatusCode.Should().Be(400);
        badRequestResult?.Value.Should().Be("At least one type name must be provided.");
    }

    [Test]
    public async Task GetPokemonsByTypes_ShouldReturnNotFound_WhenNoPokemonsFound()
    {
        // Arrange
        var typeNames = new List<string> { "Electric" };
        A.CallTo(() => _fakeTypeRepository.GetPokemonsByType(typeNames)).Returns(new List<Pokemon>());

        // Act
        var result = await _faketypeController.GetPokemonsByTypes(typeNames);

        // Assert
        var notFoundResult = result.Result as NotFoundObjectResult;
        notFoundResult.Should().NotBeNull();
        notFoundResult?.StatusCode.Should().Be(404);
        notFoundResult?.Value.Should().Be("No Pokémon found for the given types.");
    }
}
