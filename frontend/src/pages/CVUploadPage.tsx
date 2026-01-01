import React, { useState } from 'react';
import {
  Box,
  Button,
  Field,
  Input,
  VStack,
  Card,
  Heading,
  Alert,
  Text,
} from '@chakra-ui/react';
import { useUploadCV } from '@/hooks/useLetter';

interface CVUploadPageProps {
  onUploadSuccess: (sourceId: number) => void;
}

const CVUploadPage: React.FC<CVUploadPageProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const uploadCV = useUploadCV();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      uploadCV.mutate({ file }, {
        onSuccess: (data) => {
          if (data.success && data.source_id) {
            onUploadSuccess(data.source_id);
          }
        }
      });
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={8} p={4}>
      <Heading mb={6} textAlign="center">
        Upload Your Resume
      </Heading>

      <Text mb={6} textAlign="center" color="gray.600">
        First, upload your resume (PDF format) to get started with cover letter generation.
      </Text>

      <Card.Root>
        <Card.Header>
          <Heading size="md">Resume Upload</Heading>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <VStack gap={4}>
              <Field.Root required>
                <Field.Label>Resume File (PDF)</Field.Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Field.HelperText>
                  Only PDF files are supported. Maximum size: 10MB.
                </Field.HelperText>
              </Field.Root>

              <Button
                type="submit"
                colorScheme="blue"
                loading={uploadCV.isPending}
                loadingText="Uploading..."
                width="full"
                disabled={!file}
              >
                Upload Resume
              </Button>
            </VStack>
          </form>

          {uploadCV.isError && (
            <Alert.Root status="error" mt={4}>
              <Alert.Indicator />
              <Alert.Title>Upload Failed!</Alert.Title>
              <Alert.Description>
                {uploadCV.error.message}
              </Alert.Description>
            </Alert.Root>
          )}

          {uploadCV.isSuccess && uploadCV.data?.success && (
            <Alert.Root status="success" mt={4}>
              <Alert.Indicator />
              <Alert.Title>Upload Successful!</Alert.Title>
              <Alert.Description>
                Your resume has been uploaded successfully. Resume ID: {uploadCV.data.source_id}
              </Alert.Description>
            </Alert.Root>
          )}
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default CVUploadPage;
