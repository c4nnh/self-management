import { api } from '@/utils/api'
import { Role } from '../../types'

function Pokemons() {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' })
  return <div>pokemons</div>
}

Pokemons.roles = [Role.USER]

export default Pokemons
