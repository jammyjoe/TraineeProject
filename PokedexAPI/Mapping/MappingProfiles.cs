using AutoMapper;
using Pokedex.DTOs;
using PokedexAPI.DTOs;
using PokedexAPI.Models;

namespace Pokedex.Mapping
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Pokemon, PokemonDto>();
            CreateMap<PokemonDto, Pokemon>();
            CreateMap<Pokemon, PokemonType>();
            CreateMap<PokemonType, Pokemon>();

            CreateMap<Pokemon, PokemonDto>()
                .ForMember(dest => dest.Type1, opt => opt.MapFrom(src => src.Type1))
                .ForMember(dest => dest.Type2, opt => opt.MapFrom(src => src.Type2))
                .ForMember(dest => dest.PokemonWeaknesses, opt => opt.MapFrom(src => src.PokemonWeaknesses))
                .ForMember(dest => dest.PokemonStrengths, opt => opt.MapFrom(src => src.PokemonStrengths));

            CreateMap<PokemonType, PokemonTypeDto>();
            CreateMap<PokemonTypeDto, PokemonType>();
            CreateMap<PokemonWeakness, PokemonWeaknessDto>();
            CreateMap<PokemonStrength, PokemonStrengthDto>();
        }
    }
}