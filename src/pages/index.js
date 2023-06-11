import { useState } from 'react'

import Link from 'next/link'

export default function Home ({ arrayPokemonReduce }) {
  // Implementando búsqueda por nombre y tipo de pokemon, ignorando mayúsculas y minúsculas
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(arrayPokemonReduce)

  const HandleSearch = e => {
    const value = e.target.value
    setSearch(value)

    const filtered = arrayPokemonReduce.filter(poke => {
      const nameMatch = poke.name.toLowerCase().includes(value.toLowerCase())
      const typeMatch = poke.type.some(type =>
        type.type.name.toLowerCase().includes(value.toLowerCase())
      )
      return nameMatch || typeMatch
    })
    setFilter(filtered)
  }
  return (
    <>
      <div>
        <ul>
          <input
            value={search}
            onChange={HandleSearch}
          />
          {filter.map((poke, index) => (
            <li key={index}>
              <Link href={`pokemon/${poke.name}`}>
                <div>
                  <div>
                    <h3>{poke.name}</h3>
                    <img
                      src={poke.url}
                      alt={poke.name}
                    />
                  </div>
                  {poke.type.map((type, index) => {
                    return (
                      <div key={index}>
                        <span>{type.type.name}</span>
                      </div>
                    )
                  })}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
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

  for (let i = 1; i <= 50; i++) {
    const data = await GetPokemons(i)
    arrayPokemons.push(data)
  }
  // Mejorando el rendimiento al cargar el array de pokemon
  const arrayPokemonReduce = arrayPokemons.map(poke => {
    return ({
      id: poke.id,
      name: poke.name,
      url: poke.sprites.other.dream_world.front_default,
      type: poke.types
    })
  })

  return {
    props: {
      arrayPokemonReduce
    }
  }
}
