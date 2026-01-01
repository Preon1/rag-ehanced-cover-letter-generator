from openai import OpenAI
from app.services.pdf import PdfService
from app.schemas.rag import RAGSearchResult
from app.storage.repository.qdrant import QdrantStorage
from typing import List, Dict, Any
import json
class LetterService():
    def __init__(self):
        self.client = OpenAI()
        self.storage = QdrantStorage()
        self.pdf_service = PdfService()

    async def search_job_requirements(self, job_title: str, company: str = None) -> str:
        """
        Ищет требования для вакансии используя OpenAI с web_search_preview tool

        Args:
            job_title: Название вакансии
            company: Название компании (опционально)

        Returns:
            str: Требования к вакансии в текстовом формате
        """
        search_query = f"требования к вакансии {job_title}"
        if company:
            search_query += f" в компании {company}"

        messages = [
            {
                "role": "user",
                "content": f"Найди и суммируй основные требования и обязанности для вакансии '{job_title}'{' в компании ' + company if company else ''}. Используй поиск в интернете для получения актуальной информации."
            }
        ]

        try:
            response = self.client.chat.completions.create(
                model="gpt-5-mini",
                messages=messages,
                max_tokens=800,
                temperature=0.7
            )

            return response.choices[0].message.content

        except Exception as e:
            return f"Ошибка при поиске требований: {str(e)}"

    async def generate_cover_letter(self, job_requirements: str, source_id: int) -> str:
        """
        Генерирует сопроводительное письмо на основе требований вакансии и данных из резюме

        Args:
            job_requirements: Требования к вакансии (полученные из search_job_requirements)
            source_id: ID источника резюме в базе данных

        Returns:
            str: Сгенерированное сопроводительное письмо
        """
        # Ищем релевантные данные из резюме в векторной базе
        def _search_resume_data(query: str, top_k: int = 10):
            query_vec = self.pdf_service.embed_texts([query])[0]
            found = self.storage.search(query_vector=query_vec, top_k=top_k)

            # Фильтруем результаты по source_id
            filtered_contexts = []
            filtered_sources = []
            for context, source in zip(found["contexts"], found["sources"]):
                if source.get("source_id") == source_id:
                    filtered_contexts.append(context)
                    filtered_sources.append(source)

            return RAGSearchResult(contexts=filtered_contexts, sources=filtered_sources)

        # Получаем ключевые навыки и опыт из резюме
        skills_query = "ключевые навыки опыт образование достижения"
        resume_data = _search_resume_data(skills_query)

        if not resume_data.contexts:
            return "Не найдены данные резюме в базе данных. Сначала загрузите свое резюме."

        # Формируем контекст из резюме
        resume_context = "\n\n".join(f"- {c}" for c in resume_data.contexts)

        prompt = f"""
        Ты - помощник по созданию профессиональных сопроводительных писем.

        У тебя есть:
        1. Требования к вакансии: {job_requirements}
        2. Данные из резюме кандидата: {resume_context}

        Задача: Создать персонализированное сопроводительное письмо, которое:
        - Подчеркивает релевантный опыт и навыки из резюме
        - Показывает соответствие требованиям вакансии
        - Демонстрирует интерес к компании и позиции
        - Написано в профессиональном, но дружелюбном тоне
        - Имеет стандартную структуру: вступление, основная часть, заключение
        - Данные из резюме подставь в письмо без прочерков и пустых строк.

        Письмо должно быть на том языке, на котором написаны требования для вакансии. Объемом 250-400 слов.
"""

        try:
            response = self.client.responses.create(
                model="gpt-5-mini",
                input=prompt
            )

            return response.output_text

        except Exception as e:
            return f"Ошибка при генерации сопроводительного письма: {str(e)}" 
    async def add_cv(self, pdf_path: str, source_id: int):
        """
        Загружает CV в векторную базу данных

        Args:
            pdf_path: Путь к PDF файлу резюме
            source_id: Уникальный ID источника
        """
        await self.pdf_service.add_cv(pdf_path, source_id)

    async def generate_by_url(self, job_url: str, source_id: int) -> str:
        """
        Генерирует сопроводительное письмо на основе URL вакансии и данных из резюме

        Args:
            job_url: URL страницы с вакансией
            source_id: ID источника резюме в базе данных

        Returns:
            str: Сгенерированное сопроводительное письмо
        """
        # Шаг 1: Парсим требования из URL вакансии
        job_requirements = await self._parse_job_requirements_from_url(job_url)
        if not job_requirements or job_requirements.startswith("Ошибка"):
            return job_requirements

        # Шаг 2: Получаем данные из резюме и генерируем письмо
        return await self.generate_cover_letter(job_requirements, source_id)

    async def _parse_job_requirements_from_url(self, job_url: str) -> str:
        """
        Парсит требования к вакансии из URL страницы

        Args:
            job_url: URL страницы с вакансией

        Returns:
            str: Извлеченные требования к вакансии
        """
        prompt = f"""
        Проанализируй страницу вакансии по URL: {job_url}
        Затем пиши на том языке, на котором информация на странице вакансии.
        Извлеки и суммируй следующую информацию:
        - Название вакансии
        - Основные обязанности
        - Требуемые навыки и компетенции
        - Требуемый опыт работы
        - Образование и квалификация
        - Дополнительные требования

        Представь информацию в структурированном виде.
        """

        try:
            response = self.client.responses.create(
                model="gpt-4.1-mini",
                tools=[{ "type": "web_search_preview" }],
                input=prompt
            )
            print("========================== RESPONSE ==========================")
            print(response.output_text)
            return response.output_text

        except Exception as e:
            print(e)
            return f"Ошибка при парсинге URL вакансии: {str(e)}"