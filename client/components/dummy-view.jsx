import React, { useEffect } from 'react'
import Cookies from 'universal-cookie'
import Head from './head'

const Dummy = () => {
  const cookies = new Cookies()

  useEffect(async () => {
    cookies.set('actual date', new Date().toString(), { path: '/' })
    cookies.set('isLogged', 'true', { path: '/', maxAge: 60 * 60 })
    console.log(await fetch('/api/v1/cookies/').then((result) => result.json()))
  }, [])

  const invalidate = () => {
    const pastDay = new Date(2014,5,3)
    console.log(pastDay)
    cookies.set('isLogged', 'true', { path: '/', expires: pastDay })
  }

  return (
    <div>
      <Head title="Hello" />
      <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
        <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
          <div className="mb-4">
            <h1 className="text-grey-darkest">Not todo List</h1>
            <div className="flex mt-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                placeholder="Add Todo"
              />
              <button
                type="button"
                className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal"
                onClick={invalidate}
              >
                Add
              </button>
            </div>
          </div>
          <div>
            <div className="flex mb-4 items-center">
              <p className="w-full text-grey-darkest">
                Add another component to Tailwind Components
              </p>
              <button
                type="button"
                className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green border-green hover:bg-green"
              >
                Done
              </button>
              <button
                type="button"
                className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red"
              >
                Remove
              </button>
            </div>
            <div className="flex mb-4 items-center">
              <p className="w-full line-through text-green">
                Submit Todo App Component to Tailwind Components
              </p>
              <button
                type="button"
                className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-grey border-grey hover:bg-grey"
              >
                Not Done
              </button>
              <button
                type="button"
                className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Dummy.propTypes = {}

export default React.memo(Dummy)
