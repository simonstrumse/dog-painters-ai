import * as React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export function Checkbox(props: Props) {
  return (
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      {...props}
    />
  )
}

