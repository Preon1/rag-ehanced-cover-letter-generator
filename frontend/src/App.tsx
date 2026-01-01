import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import CVUploadPage from '@/pages/CVUploadPage'
import LetterGenerator from '@/pages/LetterGenerator'

function App() {
  const [sourceId, setSourceId] = useState<number | null>(null)

  const handleUploadSuccess = (uploadedSourceId: number) => {
    setSourceId(uploadedSourceId)
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {sourceId ? (
        <LetterGenerator sourceId={sourceId} />
      ) : (
        <CVUploadPage onUploadSuccess={handleUploadSuccess} />
      )}
    </Box>
  )
}

export default App
