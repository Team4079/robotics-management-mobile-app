import { getProviders,signIn, getCsrfToken,useSession, getSession } from "next-auth/react"
import {InferGetServerSidePropsType} from 'next'
import { useEffect } from "react";
import { useRouter } from "next/router"
import { CtxOrReq } from "next-auth/client/_utils"


const SignIn =({providers,csrfToken}:InferGetServerSidePropsType<typeof getServerSideProps>)=>{
    const { data: session, status } = useSession()
    const router = useRouter()
    console.log(providers);
    
    useEffect(()=>{
        if(session){         
          router.push('/')
        }
    },[router, session])
    return (
        <>
       <section>
           <h1>SignIn to Continue</h1>

           <div>

                <form method="post" action="/api/auth/signin/email">
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                        <input type="email" id="email" name="email"  placeholder="Email" />
                    <button type="submit">Sign in with Email</button>
                </form>
            <h1>OR</h1>

            <div>

            {providers ? (  Object.values(providers).map((provider,i) =>{
                if(provider.id !== 'email'){
                   return (
                      <div key={provider.name}>
                          <div><button onClick={() => signIn(provider.id)} /></div>
                       </div>
                   )
                }
            }         
      )):('')}
      </div>

           </div>

       </section>
   
    </>
    )
}


export const getServerSideProps = async (context: CtxOrReq )=>{

  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(context)
        return {
            props:{providers,csrfToken},
        }
}

export default SignIn
