import React, { useState } from 'react';
import {
  Box,
  Button,
  Field,
  Input,
  Textarea,
  VStack,
  Card,
  Heading,
  Tabs,
  Alert,
  Text,
} from '@chakra-ui/react';
import { useCreateLetterFromUrl, useCreateLetterFromText } from '@/hooks/useLetter';

interface LetterGeneratorProps {
  sourceId: number;
}

const LetterGenerator: React.FC<LetterGeneratorProps> = ({ sourceId }) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createFromUrl = useCreateLetterFromUrl();
  const createFromText = useCreateLetterFromText();

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFromUrl.mutate({ url, source_id: sourceId });
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFromText.mutate({ name, description, source_id: sourceId });
  };

  return (
    <Box maxW="800px" mx="auto" mt={8} p={4}>
      <Heading mb={4} textAlign="center">
        Cover Letter Generator
      </Heading>

      <Text mb={6} textAlign="center" color="gray.600">
        Resume ID: {sourceId}
      </Text>

      <Tabs.Root variant="enclosed" defaultValue="url">
        <Tabs.List>
          <Tabs.Trigger value="url">From URL</Tabs.Trigger>
          <Tabs.Trigger value="text">From Text</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="url">
            <Card.Root>
              <Card.Header>
                <Heading size="md">Create Letter from URL</Heading>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleUrlSubmit}>
                  <VStack gap={4}>
                    <Field.Root required>
                      <Field.Label>URL</Field.Label>
                      <Input
                        type="url"
                        placeholder="https://example.com/job-description"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </Field.Root>


                    <Button
                      type="submit"
                      colorScheme="blue"
                      loading={createFromUrl.isPending}
                      loadingText="Creating..."
                      width="full"
                    >
                      Create Letter from URL
                    </Button>
                  </VStack>
                </form>

                {createFromUrl.isError && (
                  <Alert.Root status="error" mt={4}>
                    <Alert.Indicator />
                    <Alert.Title>Error!</Alert.Title>
                    <Alert.Description>
                      {createFromUrl.error.message}
                    </Alert.Description>
                  </Alert.Root>
                )}

                {createFromUrl.isSuccess && (
                  <Alert.Root status="success" mt={4}>
                    <Alert.Indicator />
                    <Alert.Title>Success!</Alert.Title>
                    <Alert.Description>
                      {createFromUrl.data.message}
                    </Alert.Description>
                  </Alert.Root>
                )}
              </Card.Body>
            </Card.Root>
          </Tabs.Content>

          <Tabs.Content value="text">
            <Card.Root>
              <Card.Header>
                <Heading size="md">Create Letter from Text</Heading>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleTextSubmit}>
                  <VStack gap={4}>
                    <Field.Root required>
                      <Field.Label>Name</Field.Label>
                      <Input
                        placeholder="Enter letter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label>Description</Field.Label>
                      <Textarea
                        placeholder="Enter letter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                    </Field.Root>


                    <Button
                      type="submit"
                      colorScheme="green"
                      loading={createFromText.isPending}
                      loadingText="Creating..."
                      width="full"
                    >
                      Create Letter from Text
                    </Button>
                  </VStack>
                </form>

                {createFromText.isError && (
                  <Alert.Root status="error" mt={4}>
                    <Alert.Indicator />
                    <Alert.Title>Error!</Alert.Title>
                    <Alert.Description>
                      {createFromText.error.message}
                    </Alert.Description>
                  </Alert.Root>
                )}

                {createFromText.isSuccess && (
                  <Alert.Root status="success" mt={4}>
                    <Alert.Indicator />
                    <Alert.Title>Success!</Alert.Title>
                    <Alert.Description>
                      {createFromText.data.message}
                    </Alert.Description>
                  </Alert.Root>
                )}
              </Card.Body>
            </Card.Root>
          </Tabs.Content>
        </Tabs.Root>
    </Box>
  );
};

export default LetterGenerator;
