import { DndEntity } from '../types/dnd';
import { cleanData } from './dataProcessor';
import { useStore } from '../store/useStore';

export async function processFile(file: File): Promise<DndEntity[]> {
  const { addProcessingLog, shouldStop, setProcessedCount } = useStore.getState();
  const content = await file.text();
  const fileType = file.name.split('.').pop()?.toLowerCase();

  addProcessingLog(`Starting to process file: ${file.name}`, 'info');

  try {
    let result: DndEntity[];
    switch (fileType) {
      case 'json':
        result = await processJsonContent(content);
        break;
      case 'html':
        result = await processHtmlContent(content);
        break;
      case 'md':
        result = await processMarkdownContent(content);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    addProcessingLog(
      `Successfully processed ${result.length} entries from ${file.name}`, 
      'success',
      { totalEntries: result.length }
    );
    
    setProcessedCount(result.length);
    return result;
  } catch (error) {
    addProcessingLog(`Error processing ${file.name}: ${error.message}`, 'error');
    throw error;
  }
}

async function processJsonContent(content: string): Promise<DndEntity[]> {
  const { addProcessingLog, shouldStop } = useStore.getState();
  try {
    const data = JSON.parse(content);
    const rawEntities = Array.isArray(data) ? data : [data];
    const entities: DndEntity[] = [];

    for (const [index, item] of rawEntities.entries()) {
      if (shouldStop) {
        addProcessingLog('Processing stopped by user', 'info');
        break;
      }

      const entity = cleanData<DndEntity>(item);
      entities.push(entity);

      if (index % 10 === 0) {
        addProcessingLog(
          `Processing progress: ${index + 1}/${rawEntities.length} items`,
          'progress',
          { processed: index + 1, total: rawEntities.length, entity }
        );
      }
    }
    
    return entities;
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

async function processHtmlContent(content: string): Promise<DndEntity[]> {
  const { addProcessingLog, shouldStop } = useStore.getState();
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  
  const elements = Array.from(doc.querySelectorAll('article, section, .entity'));
  const entities: DndEntity[] = [];
  
  for (const [index, element] of elements.entries()) {
    if (shouldStop) {
      addProcessingLog('Processing stopped by user', 'info');
      break;
    }

    const nameEl = element.querySelector('h1, h2, h3, .name');
    const typeEl = element.querySelector('.type, [data-type]');
    const descEl = element.querySelector('.description, p');
    
    if (nameEl) {
      const entity = cleanData<DndEntity>({
        name: nameEl.textContent || '',
        type: typeEl?.textContent || 'unknown',
        source: 'html-import',
        description: descEl?.textContent || ''
      });
      
      entities.push(entity);

      if (index % 10 === 0) {
        addProcessingLog(
          `Processing HTML elements: ${index + 1}/${elements.length}`,
          'progress',
          { processed: index + 1, total: elements.length, entity }
        );
      }
    }
  }
  
  return entities;
}

async function processMarkdownContent(content: string): Promise<DndEntity[]> {
  const { addProcessingLog, shouldStop } = useStore.getState();
  const sections = content.split(/^#{1,3}\s+/m).filter(Boolean);
  const entities: DndEntity[] = [];
  
  for (const [index, section] of sections.entries()) {
    if (shouldStop) {
      addProcessingLog('Processing stopped by user', 'info');
      break;
    }

    const lines = section.trim().split('\n');
    const name = lines[0].trim();
    
    const typeMatch = section.match(/Type:\s*([^\n]+)/i);
    const descriptionMatch = section.match(/Description:\s*([^\n]+)/i);
    
    const entity = cleanData<DndEntity>({
      name,
      type: typeMatch?.[1] || 'unknown',
      source: 'markdown-import',
      description: descriptionMatch?.[1] || lines.slice(1).join(' ').trim()
    });
    
    entities.push(entity);

    if (index % 10 === 0) {
      addProcessingLog(
        `Processing Markdown sections: ${index + 1}/${sections.length}`,
        'progress',
        { processed: index + 1, total: sections.length, entity }
      );
    }
  }
  
  return entities;
}