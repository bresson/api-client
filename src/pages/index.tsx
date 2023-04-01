import {useState, useEffect}  from 'react'
import Link from 'next/link'
import {startApplication} from './api'

export default function IndexPage() {

  const [applicationId, setApplicationId] = useState<string>('');

  useEffect(()=> {
    const abortController = new AbortController();
    (async() => {
      try {
        const redirectTo = await (await startApplication()).json();
        console.log('redirectTo:', redirectTo.redirectId)
        setApplicationId(redirectTo.redirectId)
      } catch(e) {
        //!!!LOG error to proper source
        console.error('user caught error:', e);
      }
    })()
    return () => abortController.abort();
}, [])

  return (
    <>
      {!applicationId && <p>Your application is initializing</p>}

      {applicationId && 
        <div>
          <Link href={`/application/${applicationId}`} style={{'padding': '4px', 'border': '1px solid blue'}}>Click here to Continue your application</Link>
          <p>This page will issue a application/redirect ID; If a user has already started an application, a new request create a new redirect ID but will still open a pending or completed application. In production, a new redirect URL can start a new application or if user has already started an application, can redirect without triggering requesting new ID, ....</p>
        </div>}
    </>
  )
};