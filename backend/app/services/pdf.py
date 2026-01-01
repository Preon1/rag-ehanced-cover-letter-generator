from openai import OpenAI
from llama_index.readers.file import PDFReader
from llama_index.core.node_parser import SentenceSplitter
from dotenv import load_dotenv
from app.storage.repository.qdrant import QdrantStorage

load_dotenv()

EMBED_MODEL="text-embedding-3-large"
EMBED_DIM=3072

class PdfService():
    def __init__(self):
        self.reader = PDFReader()
        self.client = OpenAI()
        self.storage = QdrantStorage()
        self.splitter = SentenceSplitter(chunk_size=1000,chunk_overlap=0)

    async def add_cv(self, pdf_path: str, source_id: int):
        """Загружает CV в векторную БД"""
        text_chunks = self._load_and_chunk_pdf(pdf_path)
        vectors = self.embed_texts(text_chunks)
        
        ids = [source_id * 10000 + i for i in range(len(text_chunks))]
        payloads = [
            {
                "text": chunk,
                "source": pdf_path,
                "source_id": source_id,
                "chunk_index": i
            }
            for i, chunk in enumerate(text_chunks)
        ]
        
        self.storage.upsert(ids=ids, vectors=vectors, payloads=payloads)

    def _load_and_chunk_pdf(self,path:str):
        docs = self.reader.load_data(file=path)
        texts = [d.text for d in docs if getattr(d,"text",None)]
        chunks = []
        for t in texts:
            chunks.extend(self.splitter.split_text(t))
        return chunks
    
    def embed_texts(self,texts:list[str])-> list[list[float]]:
        response =self.client.embeddings.create(
            model=EMBED_MODEL,
            dimensions=EMBED_DIM,
            input=texts
        )
        return [item.embedding for item in response.data]