export interface Similarity {
  category: string;
  description: string;
}

export interface SimilarityResponse {
  similarities: Similarity[];
  summary: string;
}
