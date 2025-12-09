import { Entity, EntityLink } from '@/types';

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching of entity names
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0-1)
 * 1 = identical, 0 = completely different
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;

  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;

  const distance = levenshteinDistance(s1, s2);
  return 1 - distance / maxLen;
}

/**
 * Check if two entities are similar based on text and type
 */
export function entitiesAreSimilar(
  entity1: Entity,
  entity2: Entity,
  threshold: number = 0.8
): boolean {
  // Must be same type
  if (entity1.type !== entity2.type) return false;

  // Calculate text similarity
  const similarity = calculateSimilarity(entity1.text, entity2.text);
  return similarity >= threshold;
}

/**
 * Calculate contextual similarity based on co-occurrence
 * Entities appearing in the same document or nearby have higher scores
 */
export function calculateContextualSimilarity(
  entity1: Entity,
  entity2: Entity,
  entities: Entity[]
): number {
  let score = 0;

  // Same document bonus
  if (entity1.documentId === entity2.documentId) {
    score += 0.5;

    // Check position proximity if available
    const pos1 = entity1.metadata?.position;
    const pos2 = entity2.metadata?.position;

    if (pos1 && pos2) {
      const distance = Math.abs(
        (pos1.start + pos1.end) / 2 - (pos2.start + pos2.end) / 2
      );
      // Closer entities get higher scores
      if (distance < 100) score += 0.3;
      else if (distance < 500) score += 0.2;
      else if (distance < 1000) score += 0.1;
    }
  }

  // Check if they appear in related contexts
  const context1 = entity1.metadata?.context?.toLowerCase() || '';
  const context2 = entity2.metadata?.context?.toLowerCase() || '';

  if (context1 && context2) {
    // Look for common words (excluding common stop words)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    const words1 = context1.split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
    const words2 = context2.split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));

    const commonWords = words1.filter(w => words2.includes(w));
    const overlap = commonWords.length / Math.max(words1.length, words2.length);
    score += overlap * 0.3;
  }

  return Math.min(score, 1.0);
}

/**
 * Find potential entity links using fuzzy matching
 */
export function findPotentialLinks(
  entity: Entity,
  allEntities: Entity[],
  options: {
    textSimilarityThreshold?: number;
    contextSimilarityThreshold?: number;
    maxResults?: number;
  } = {}
): Array<{ entity: Entity; similarity: number; contextScore: number; totalScore: number }> {
  const {
    textSimilarityThreshold = 0.7,
    contextSimilarityThreshold = 0.3,
    maxResults = 10,
  } = options;

  const candidates = allEntities
    .filter((e) => e.id !== entity.id) // Don't match with self
    .map((candidate) => {
      const textSimilarity = calculateSimilarity(entity.text, candidate.text);
      const contextScore = calculateContextualSimilarity(entity, candidate, allEntities);

      // Weighted total score: text similarity is more important
      const totalScore = textSimilarity * 0.7 + contextScore * 0.3;

      return {
        entity: candidate,
        similarity: textSimilarity,
        contextScore,
        totalScore,
      };
    })
    .filter(
      (result) =>
        result.similarity >= textSimilarityThreshold ||
        result.contextScore >= contextSimilarityThreshold
    )
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, maxResults);

  return candidates;
}

/**
 * Automatically create links for entities with high similarity
 */
export function autoLinkEntities(
  entities: Entity[],
  threshold: number = 0.85
): EntityLink[] {
  const links: EntityLink[] = [];
  const processed = new Set<string>();

  for (let i = 0; i < entities.length; i++) {
    const entity1 = entities[i];

    for (let j = i + 1; j < entities.length; j++) {
      const entity2 = entities[j];
      const linkKey = [entity1.id, entity2.id].sort().join('-');

      if (processed.has(linkKey)) continue;

      if (entitiesAreSimilar(entity1, entity2, threshold)) {
        links.push({
          id: `link-${Date.now()}-${links.length}`,
          sourceEntityId: entity1.id,
          targetEntityId: entity2.id,
          type: 'similar',
          confidence: calculateSimilarity(entity1.text, entity2.text),
          metadata: {
            createdAt: new Date().toISOString(),
            automatic: true,
          },
        });

        processed.add(linkKey);
      }
    }
  }

  return links;
}

/**
 * Calculate link strength based on various factors
 */
export function calculateLinkStrength(
  entity1: Entity,
  entity2: Entity,
  allEntities: Entity[]
): number {
  const textSim = calculateSimilarity(entity1.text, entity2.text);
  const contextSim = calculateContextualSimilarity(entity1, entity2, allEntities);
  
  // Type match bonus
  const typeBonus = entity1.type === entity2.type ? 0.1 : 0;
  
  // Confidence bonus - both entities should be confident
  const confidenceBonus = (entity1.confidence + entity2.confidence) / 2 * 0.1;

  return Math.min(textSim * 0.6 + contextSim * 0.3 + typeBonus + confidenceBonus, 1.0);
}

/**
 * Group similar entities into clusters
 */
export function clusterEntities(
  entities: Entity[],
  similarityThreshold: number = 0.8
): Entity[][] {
  const clusters: Entity[][] = [];
  const assigned = new Set<string>();

  for (const entity of entities) {
    if (assigned.has(entity.id)) continue;

    const cluster: Entity[] = [entity];
    assigned.add(entity.id);

    // Find all similar entities
    for (const candidate of entities) {
      if (assigned.has(candidate.id)) continue;

      if (entitiesAreSimilar(entity, candidate, similarityThreshold)) {
        cluster.push(candidate);
        assigned.add(candidate.id);
      }
    }

    if (cluster.length > 0) {
      clusters.push(cluster);
    }
  }

  return clusters;
}

/**
 * Suggest merge candidates for entity deduplication
 */
export function suggestMergeCandidates(
  entity: Entity,
  entities: Entity[]
): Array<{ entity: Entity; reason: string; confidence: number }> {
  return entities
    .filter((e) => e.id !== entity.id && e.type === entity.type)
    .map((candidate) => {
      const similarity = calculateSimilarity(entity.text, candidate.text);
      
      let reason = '';
      let confidence = similarity;

      if (similarity > 0.95) {
        reason = 'Nearly identical text';
      } else if (similarity > 0.85) {
        reason = 'Very similar text';
      } else if (similarity > 0.75) {
        reason = 'Similar text';
      } else if (entity.documentId === candidate.documentId) {
        reason = 'Same document';
        confidence += 0.1;
      } else {
        return null; // Not similar enough
      }

      return { entity: candidate, reason, confidence: Math.min(confidence, 1.0) };
    })
    .filter((r): r is { entity: Entity; reason: string; confidence: number } => r !== null)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}

