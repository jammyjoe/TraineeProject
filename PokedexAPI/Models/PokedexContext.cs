using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace PokedexAPI.Models
{
    public partial class PokedexContext : DbContext
    {
        public PokedexContext()
        {
        }

        public PokedexContext(DbContextOptions<PokedexContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Pokemon> Pokemons { get; set; } = null!;
        public virtual DbSet<PokemonStrength> PokemonStrengths { get; set; } = null!;
        public virtual DbSet<PokemonType> PokemonTypes { get; set; } = null!;
        public virtual DbSet<PokemonWeakness> PokemonWeaknesses { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name=DefaultConnection");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("Latin1_General_CI_AS");

            modelBuilder.Entity<Pokemon>(entity =>
            {
                entity.ToTable("pokemon");

                entity.HasIndex(e => e.Type1Id, "IX_pokemon_type1_id");

                entity.HasIndex(e => e.Type2Id, "IX_pokemon_type2_id");

                entity.Property(e => e.Id)
                    .UseIdentityColumn()
                    .HasColumnName("id");

                entity.Property(e => e.Name)
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("name");

                entity.Property(e => e.Type1Id).HasColumnName("type1_id");

                entity.Property(e => e.Type2Id).HasColumnName("type2_id");

                entity.HasOne(d => d.Type1)
                    .WithMany(p => p.Pokemons)
                    .HasForeignKey(d => d.Type1Id)
                    .HasConstraintName("fk_type_id");
            });

            modelBuilder.Entity<PokemonStrength>(entity =>
            {
                entity.ToTable("pokemon_strength");

                entity.HasIndex(e => e.PokemonId, "IX_pokemon_resistance_pokemon_id");

                entity.HasIndex(e => e.TypeId, "IX_pokemon_resistance_type_id");

                entity.Property(e => e.Id)
                    .UseIdentityColumn()
                    .HasColumnName("id");

                entity.Property(e => e.PokemonId).HasColumnName("pokemon_id");

                entity.Property(e => e.TypeId).HasColumnName("type_id");

                entity.HasOne(d => d.Pokemon)
                    .WithMany(p => p.PokemonStrengths)
                    .HasForeignKey(d => d.PokemonId)
                    .HasConstraintName("FK__pokemon_r__pokem__5441852A");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.PokemonStrengths)
                    .HasForeignKey(d => d.TypeId)
                    .HasConstraintName("FK__pokemon_r__type___5535A963");
            });

            modelBuilder.Entity<PokemonType>(entity =>
            {
                entity.ToTable("pokemon_type");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("id");

                entity.Property(e => e.TypeName)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("type_name");
            });

            modelBuilder.Entity<PokemonWeakness>(entity =>
            {
                entity.ToTable("pokemon_weakness");

                entity.HasIndex(e => e.PokemonId, "IX_pokemon_weakness_pokemon_id");

                entity.HasIndex(e => e.TypeId, "IX_pokemon_weakness_type_id");

                entity.Property(e => e.Id)
                    .UseIdentityColumn()
                    .HasColumnName("id");

                entity.Property(e => e.PokemonId).HasColumnName("pokemon_id");

                entity.Property(e => e.TypeId).HasColumnName("type_id");

                entity.HasOne(d => d.Pokemon)
                    .WithMany(p => p.PokemonWeaknesses)
                    .HasForeignKey(d => d.PokemonId)
                    .HasConstraintName("FK__pokemon_w__pokem__4D94879B");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.PokemonWeaknesses)
                    .HasForeignKey(d => d.TypeId)
                    .HasConstraintName("FK__pokemon_w__weakn__4E88ABD4");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
