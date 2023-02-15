import { api } from '@/utils/api'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { AppLayout } from '../components/layouts/App'

const Home: NextPage = () => {
  const { data: session } = useSession()
  const { data } = api.example.hello.useQuery({ text: 'from tRPC' })
  const { data: secretData } = api.example.getSecretMessage.useQuery(
    undefined,
    {
      enabled: !!session?.user,
    }
  )

  return (
    <AppLayout>
      <div className="text-red-500 font-bold text-3xl">
        home page - {JSON.stringify(session?.user?.role)}
        {data?.greeting}
        {secretData}
      </div>
    </AppLayout>
  )
}

export default Home
