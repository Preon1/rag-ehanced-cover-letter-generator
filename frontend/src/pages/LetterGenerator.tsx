import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
} from '@chakra-ui/react';
import { useCreateLetterFromUrl, useCreateLetterFromText } from '@/hooks/useLetter';

interface LetterGeneratorProps {
  sourceId: number;
  onBack?: () => void;
}

const LetterGenerator: React.FC<LetterGeneratorProps> = ({ sourceId, onBack }) => {
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
      {onBack && (
        <Button
          onClick={onBack}
          mb={4}
          variant="outline"
          leftIcon={<span>←</span>}
        >
          Назад к загрузке CV
        </Button>
      )}

      <Heading mb={4} textAlign="center">
        Cover Letter Generator
      </Heading>

      <Text mb={6} textAlign="center" color="gray.600">
        Resume ID: {sourceId}
      </Text>

      <Tabs variant="enclosed" defaultIndex={0}>
        <TabList>
          <Tab>From URL</Tab>
          <Tab>From Text</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">Create Letter from URL</Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleUrlSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>URL</FormLabel>
                      <Input
                        type="url"
                        placeholder="https://example.com/job-description"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      isLoading={createFromUrl.isPending}
                      loadingText="Creating..."
                      width="full"
                    >
                      Create Letter from URL
                    </Button>
                  </VStack>
                </form>

                {createFromUrl.isError && (
                  <Alert status="error" mt={4}>
                    <AlertIcon />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>
                      {createFromUrl.error.message}
                    </AlertDescription>
                  </Alert>
                )}

                {createFromUrl.isSuccess && (
                  <Alert status="success" mt={4}>
                    <AlertIcon />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      {createFromUrl.data.message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">Create Letter from Text</Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleTextSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input
                        placeholder="Enter letter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        placeholder="Enter letter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                    </FormControl>


                    <Button
                      type="submit"
                      colorScheme="green"
                      isLoading={createFromText.isPending}
                      loadingText="Creating..."
                      width="full"
                    >
                      Create Letter from Text
                    </Button>
                  </VStack>
                </form>

                {createFromText.isError && (
                  <Alert status="error" mt={4}>
                    <AlertIcon />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>
                      {createFromText.error.message}
                    </AlertDescription>
                  </Alert>
                )}

                {createFromText.isSuccess && (
                  <Alert status="success" mt={4}>
                    <AlertIcon />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      {createFromText.data.message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default LetterGenerator;
