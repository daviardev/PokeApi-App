export default function Home ({ arrayPokemonReduce }) {
  console.log(arrayPokemonReduce)
  return (
    <>

    </>
  )
}
// Se usa getServerSideProps para cargar los datos de la api en el lado del servidor
export async function getServerSideProps () {
  const GetPokemons = async id => {
    // Obtiene la api para que de esta manera, los formatee a un json para mostrar los datos
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      const data = await response.json()
      return data
    } catch (err) {
      console.error(err)
      return null
    }
  }
  // Lista los 20 pokemon para guardarlos en un array
  const arrayPokemons = []

  for (let i = 1; i <= 20; i++) {
    const data = await GetPokemons(i)
    arrayPokemons.push(data)
  }

  const arrayPokemonReduce = arrayPokemons.map(poke => {
    return ({
      id: poke.id,
      name: poke.name,
      url: poke.sprites.other.dream_world.front_default,
      types: poke.types
    })
  })

  return {
    props: {
      arrayPokemonReduce
    }
  }
}
