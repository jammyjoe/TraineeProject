# Pokedex

Welcome to my Pokedex app which utilises a SQL database, REST Api and Angular FrontEnd.

Currently the application is deployed to azure using pipelines with terraform providing the infrastructure. 

# Understanding the Application
A pokedex is used to query entries of pokemon on the pokedex. Each Pokemon has following properties: Name, Type 1, Type 2 (Optional) and a collection of weaknesses and strengths. 

There is a home page which renders all the pokemons that exist on the SQL database. A search page which allows you to search a specific pokemon with a delete or edit widget beside the pokemon details.

The edit widget takes you to the edit page allowing you to edit prexisting properties of the pokemon you've searched up.

Finally an add page to create a new pokemon with its properties.

# Pokedex API
Pokedex API contains a PokemonController which is responsible for api calls to the pokedex as well as a TypeController which handles api calls to the fixed type list. 
Logic is handled using the Repository which maps Pokemon Models to its DTOs as well as performing checks to ensure the API payload is correct. Finally there is PokedexAPI.Tests containing unit tests for the controller and their REST methods.

# Pokedex App
Pokedex App utilises Angular Framework to render a dynamic website which uses CORS to make Http calls using PokedexAPI. The Pokedex app uses a PokemonServices to makes these HttpCalls which is injected into pages that utlises the HttpCalls. 
For example the home page calls GetAllPokemons to generate cards of all the Pokemons in UI friendly way. TailwindCSS, Typescript and HTMl are used as frontend code to generate these pages.

# Pokedex SQL Database
Pokedex SQL Database uses Entity Framework to create models based on relational mappings made between Pokemons, Type, PokemonStrengths, PokemonWeaknesses. Using foreign keys to cross references the types as they exist as a fixed list of 18 types that are references using their IDs.
Similarly the PokemonWeaknesses and PokemonStrengths tables use foreign keys from both TypeId and PokemonId to map a pokemons strength/weakness.

# Pokedex Azure Storage Account
Pokedex Azure Storage Account uses blob containers to host Pokemon Images used and retrieved by my database, this allows a seamless and memory efficient way of rendering and storing many images.

# Deployment
This application uses YAML to build and deploy the apps and the Infrastructure is created using terraform via bash scripts. The YAML has been split out into build templates and deploy templates with a deploy_infrastructure.yml to trigger a bash script and create the terraform resources in azure.
_