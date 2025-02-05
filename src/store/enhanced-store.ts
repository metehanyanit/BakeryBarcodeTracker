interface EnhancedStore extends Store {
  campaigns: Campaign[];
  activeEntities: Set<string>;
  filters: AdvancedFilters;
  search: {
    index: SearchIndex;
    results: SearchResult[];
    query: string;
  };
}

export const useStore = create<EnhancedStore>()
  .persist({
    name: 'dnd-assistant',
    storage: indexedDB
  })
  .subscribe(handleStateChanges); 