import { Link } from 'react-router-dom'

import { Button } from '@/components/common/Button'

export const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          Page not found
        </h2>
        <p className="mt-2 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-6">
          <Link to="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
