export default function Pokemon ({ data }) {
  return (
    <>
      <div>
        <h1>Hola soy {data.name} tu pokemon favorito</h1>
      </div>
    </>
  )
}

export async function getServerSideProps (context) {
  const { name } = context.query

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  const data = await response.json()
  return {
    props: {
      data
    }
  }
}
