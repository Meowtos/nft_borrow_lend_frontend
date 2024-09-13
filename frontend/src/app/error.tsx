'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { BiRecycle } from 'react-icons/bi'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <section className="inner-banner">
      <div className="container">
        <div className="row">
          <h2>Sorry, something went wrong</h2>
          <p>We are already on the issue</p>
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            <BiRecycle />
          </button>
        </div>
      </div>
    </section>
  )
}