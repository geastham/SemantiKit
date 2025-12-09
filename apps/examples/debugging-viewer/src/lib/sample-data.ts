import { RAGTrace, RetrievedChunk, PerformanceMetrics } from '@/types';
import { generateMockEmbedding } from './utils';

export function generateSampleTrace(query: string): RAGTrace {
  const chunks = generateSampleChunks();
  const embeddingLatency = 45 + Math.random() * 15;
  const searchLatency = 90 + Math.random() * 30;
  const rerankLatency = 25 + Math.random() * 15;
  const llmLatency = 1100 + Math.random() * 300;

  return {
    id: `trace-${Date.now()}`,
    query,
    timestamp: Date.now(),
    steps: [
      {
        id: 'step-embed',
        name: 'embedding',
        startTime: 0,
        endTime: embeddingLatency,
        latency: embeddingLatency,
        model: 'text-embedding-3-small',
        dimensions: 1536,
        cost: 0.0001,
      },
      {
        id: 'step-search',
        name: 'search',
        startTime: embeddingLatency,
        endTime: embeddingLatency + searchLatency,
        latency: searchLatency,
        engine: 'Pinecone',
        candidatesRetrieved: 50,
        queryVector: generateMockEmbedding(),
      },
      {
        id: 'step-rerank',
        name: 'rerank',
        startTime: embeddingLatency + searchLatency,
        endTime: embeddingLatency + searchLatency + rerankLatency,
        latency: rerankLatency,
        model: 'cohere-rerank-v3',
        inputCount: 50,
        outputCount: 5,
        cost: 0.001,
      },
      {
        id: 'step-llm',
        name: 'llm',
        startTime: embeddingLatency + searchLatency + rerankLatency,
        endTime: embeddingLatency + searchLatency + rerankLatency + llmLatency,
        latency: llmLatency,
        model: 'gpt-4-turbo',
        tokensUsed: 3200,
        cost: 0.032,
      },
    ],
    totalLatency: embeddingLatency + searchLatency + rerankLatency + llmLatency,
    totalCost: 0.0331,
    chunks: chunks.slice(0, 5),
  };
}

export function generateSampleChunks(): RetrievedChunk[] {
  const documents = [
    { id: 'doc-1', name: 'paris_agreement.pdf', content: 'The Paris Agreement is a legally binding international treaty on climate change. It was adopted by 196 Parties at COP 21 in Paris, on 12 December 2015 and entered into force on 4 November 2016.' },
    { id: 'doc-2', name: 'climate_treaties.pdf', content: 'Climate treaty frameworks include various international agreements designed to reduce greenhouse gas emissions. The Paris Agreement represents the most comprehensive effort to date.' },
    { id: 'doc-3', name: 'cop21_summary.pdf', content: 'COP 21 (Conference of the Parties) was held in Paris from November 30 to December 12, 2015. The conference resulted in the Paris Agreement, which aims to limit global temperature increase.' },
    { id: 'doc-4', name: 'emissions_targets.pdf', content: 'Under the Paris Agreement, countries submit their plans for climate action known as nationally determined contributions (NDCs). These targets are updated every five years.' },
    { id: 'doc-5', name: 'temperature_goals.pdf', content: 'The Paris Agreement goal is to limit global warming to well below 2°C, preferably to 1.5°C, compared to pre-industrial levels. This requires rapid reductions in emissions.' },
  ];

  const baseScores = [0.92, 0.87, 0.84, 0.79, 0.76];
  const originalRanks = [1, 3, 2, 5, 4];

  return documents.map((doc, i) => ({
    id: `chunk-${i + 1}`,
    documentId: doc.id,
    documentName: doc.name,
    chunkIndex: Math.floor(Math.random() * 10),
    content: doc.content,
    score: baseScores[i],
    rank: i + 1,
    originalRank: originalRanks[i],
    metadata: {
      embedding: generateMockEmbedding(),
      length: doc.content.length,
      overlap: Math.floor(Math.random() * 50),
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }));
}

export function generateSampleMetrics(): PerformanceMetrics {
  return {
    latency: { embedding: 45, search: 95, rerank: 28, total: 1368 },
    quality: { precisionAtK: 0.8, recallAtK: 0.65, rerankImprovement: 0.15, relevanceScore: 0.82 },
    cost: { embedding: 0.0001, search: 0.0, rerank: 0.001, llm: 0.032, total: 0.0331 },
    coverage: { documentsRetrieved: 50, uniqueDocuments: 15, chunkDistribution: { 'doc-1': 12, 'doc-2': 8, 'doc-3': 10, 'doc-4': 15, 'doc-5': 5 } },
  };
}

export const sampleQueries = [
  'What is the Paris Agreement?',
  'How do climate treaties work?',
  'What are the temperature goals for climate change?',
  'Explain nationally determined contributions',
  'When was the Paris Agreement signed?',
];
