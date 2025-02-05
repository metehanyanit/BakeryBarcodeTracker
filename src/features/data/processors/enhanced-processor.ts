export class DndDataProcessor {
  private readonly validators: Record<string, ValidationSchema>;
  private readonly transformers: Record<string, DataTransformer>;
  
  async process(file: File): Promise<ProcessedData> {
    const content = await this.readFile(file);
    const entityType = this.detectEntityType(content);
    
    // Validate raw data
    await this.validators[entityType].validate(content);
    
    // Transform to internal format
    const transformed = await this.transformers[entityType].transform(content);
    
    // Enrich with additional data
    return this.enrichData(transformed);
  }
  
  private async enrichData(data: DndEntity): Promise<EnrichedDndEntity> {
    // Add references, relationships, and computed properties
    return {
      ...data,
      relationships: await this.findRelationships(data),
      stats: this.computeEntityStats(data),
      searchableText: this.generateSearchableText(data)
    };
  }
} 