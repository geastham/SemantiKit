import OpenAI from 'openai';
import { Entity, EntityType, ExtractionResult } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EXTRACTION_PROMPT = `You are an expert entity extraction system. Extract entities from the provided text and classify them into these types:
- Person: Individual people (e.g., "John Smith", "Dr. Jane Doe")
- Organization: Companies, institutions, agencies (e.g., "United Nations", "Microsoft")
- Location: Cities, countries, regions (e.g., "Paris", "European Union")
- Date: Specific dates or time periods (e.g., "2024", "January 15th")
- Concept: Abstract ideas, theories, methodologies (e.g., "Climate Change", "Democracy")
- Product: Specific products or services (e.g., "iPhone 15", "ChatGPT")
- Event: Named events, conferences, incidents (e.g., "COP28", "World War II")
- Metric: Measurements, statistics, KPIs (e.g., "2.5 billion tons", "15% increase")
- Treaty: Agreements, accords, legal documents (e.g., "Paris Agreement", "NAFTA")

For each entity found:
1. Extract the exact text
2. Classify the type
3. Assign a confidence score (0-1)
4. Provide surrounding context (1-2 sentences)
5. Note the approximate position in the text

Return valid JSON only with this structure:
{
  "entities": [
    {
      "text": "entity text",
      "type": "EntityType",
      "confidence": 0.95,
      "context": "surrounding text...",
      "position": { "start": 0, "end": 10 }
    }
  ]
}`;

export async function extractEntities(
  text: string,
  documentId: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<ExtractionResult> {
  try {
    const response = await openai.chat.completions.create({
      model: options?.model || 'gpt-4-turbo-preview',
      temperature: options?.temperature || 0.3,
      max_tokens: options?.maxTokens || 4000,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: EXTRACTION_PROMPT,
        },
        {
          role: 'user',
          content: `Extract entities from this text:\n\n${text.slice(0, 10000)}`, // Limit to first 10k chars
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    
    // Transform OpenAI response to our Entity format
    const entities: Entity[] = parsed.entities.map((e: any, index: number) => ({
      id: `${documentId}-entity-${Date.now()}-${index}`,
      documentId,
      text: e.text,
      type: e.type as EntityType,
      confidence: e.confidence,
      metadata: {
        context: e.context,
        position: e.position,
        extractedAt: new Date().toISOString(),
      },
      approved: false,
      rejected: false,
      linkedTo: [],
    }));

    return {
      documentId,
      entities,
      extractedAt: new Date().toISOString(),
      model: options?.model || 'gpt-4-turbo-preview',
      metadata: {
        tokensUsed: response.usage?.total_tokens || 0,
        processingTime: 0, // Will be calculated by caller
      },
    };
  } catch (error) {
    console.error('Entity extraction failed:', error);
    throw error;
  }
}

// Mock extraction for testing without API key
export async function mockExtractEntities(
  text: string,
  documentId: string
): Promise<ExtractionResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simple keyword-based extraction for demo
  const keywords = [
    { text: 'Paris Agreement', type: EntityType.Treaty, confidence: 0.98 },
    { text: 'United Nations', type: EntityType.Organization, confidence: 0.95 },
    { text: 'Climate Change', type: EntityType.Concept, confidence: 0.92 },
    { text: 'Carbon Emissions', type: EntityType.Metric, confidence: 0.88 },
    { text: 'renewable energy', type: EntityType.Concept, confidence: 0.85 },
    { text: '2024', type: EntityType.Date, confidence: 0.90 },
  ];

  const entities: Entity[] = [];
  keywords.forEach((keyword, index) => {
    if (text.toLowerCase().includes(keyword.text.toLowerCase())) {
      const position = text.toLowerCase().indexOf(keyword.text.toLowerCase());
      const contextStart = Math.max(0, position - 50);
      const contextEnd = Math.min(text.length, position + keyword.text.length + 50);
      
      entities.push({
        id: `${documentId}-entity-${Date.now()}-${index}`,
        documentId,
        text: keyword.text,
        type: keyword.type,
        confidence: keyword.confidence,
        metadata: {
          context: text.slice(contextStart, contextEnd).trim(),
          position: { start: position, end: position + keyword.text.length },
          extractedAt: new Date().toISOString(),
        },
        approved: false,
        rejected: false,
        linkedTo: [],
      });
    }
  });

  return {
    documentId,
    entities,
    extractedAt: new Date().toISOString(),
    model: 'mock-extractor',
    metadata: {
      tokensUsed: 0,
      processingTime: 1500,
    },
  };
}

// Document text extraction utilities
export async function extractTextFromPDF(file: File): Promise<string> {
  // This would use pdf-parse in a real implementation
  // For now, return a placeholder
  return `Sample text extracted from ${file.name}`;
}

export async function extractTextFromDOCX(file: File): Promise<string> {
  // This would use mammoth in a real implementation
  return `Sample text extracted from ${file.name}`;
}

export async function extractTextFromPlainText(file: File): Promise<string> {
  return await file.text();
}

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return await extractTextFromPDF(file);
    case 'docx':
      return await extractTextFromDOCX(file);
    case 'txt':
    case 'md':
      return await extractTextFromPlainText(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

