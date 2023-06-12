import { useState } from 'react'

import Head from 'next/head'
import Link from 'next/link'

export default function Home ({ arrayPokemonReduce }) {
  // Implementando búsqueda por nombre y tipo de pokemon, ignorando mayúsculas y minúsculas
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(arrayPokemonReduce)

  const HandleSearch = e => {
    const value = e.target.value
    setSearch(value)

    const filtered = arrayPokemonReduce.filter(poke => {
      const idMatch = poke.id.toString().includes(value.toLowerCase())
      const nameMatch = poke.name.toLowerCase().includes(value.toLowerCase())
      return nameMatch || idMatch
    })
    setFilter(filtered)
  }
  return (
    <>
      <Head>
        <title>Pokédex · Pokemon.com</title>
        <meta name='description' content='Pokédex app PokeApi Next.js Tailwind CSS' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.svg' />
      </Head>
      <nav className='bg-[#333333aa] sticky top-0 z-10 backdrop-blur'>
        <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
          <Link href='/' className='flex items-center'>
            <img
              src='/favicon.svg'
              className='h-16 mr-3'
              alt='Pokédex Logo'
            />
            <span className='self-center text-[48px] font-semibold whitespace-nowrap text-white'>
              Pokédex
            </span>
          </Link>
          <div className='flex'>
            <input
              type='text'
              value={search}
              onChange={HandleSearch}
              className='w-[320px] p-2 text-sm text-white border rounded-full bg-transparent'
              placeholder='Búsqueda por nombre o número'
            />
          </div>
        </div>
      </nav>
      <section className='section'>
        <ul className='h-auto float-left mr-[-100%] ml-[7.2525%] w-[85.49%]'>
          {filter.map((poke, index) => (
            <li
              key={index}
              style={{ opacity: '1', top: '0px', left: '0px', transform: 'matrix(1, 0, 0, 1, 0, 0)' }}
              className='block float-right relative mt-4 ml-[.7825%] mr-[50px] w-[23.4375%]'
            >
              <Link href={`pokemon/${poke.name}`} className='float-left block relative rounded-md w-full pt-[100%]'>
                <div className='clear-both pl-[7.2525%]'>
                  <img
                    src={poke.url}
                    alt={poke.name}
                    className='float-left w-[180px] h-[180px] rounded-lg pb-4 mt-4 absolute top-0 bg-gray-200'
                  />
                  <p className='text-[rgba(125,125,125,0.6)] flex text-center text-[16px] pt-1'>#{poke.id}</p>
                  <h5 className='text-white text-[145%] mb-2'>{poke.name}</h5>
                  {poke.type.map((type, index) => {
                    return (
                      <div
                        key={index}
                        className={`${type.type.name}`}
                      >
                        <span className='flex rounded max-w-[110px] mt-0 mr-[1.5625%] mb-4 w-[38.4375%] text-[11px] text-white'>{type.type.name}</span>
                      </div>
                    )
                  })}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
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
