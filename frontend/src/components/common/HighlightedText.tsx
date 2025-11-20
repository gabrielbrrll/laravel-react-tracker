interface HighlightedTextProps {
  text: string
  searchTerm?: string
}

export const HighlightedText = ({ text, searchTerm }: HighlightedTextProps) => {
  if (!searchTerm || !searchTerm.trim()) {
    return <>{text}</>
  }

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark
            key={index}
            className="bg-yellow-200 font-semibold text-gray-900"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}
