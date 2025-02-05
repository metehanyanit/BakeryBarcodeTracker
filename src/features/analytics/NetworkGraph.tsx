import { ForceGraph2D } from 'react-force-graph';

export function EntityRelationshipGraph({ data }: { data: DndEntity[] }) {
  const graphData = useMemo(() => {
    const nodes = data.map(entity => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      // Add visual properties based on entity type
      color: getEntityColor(entity.type),
      size: getEntitySize(entity)
    }));

    const links = generateEntityLinks(data);

    return { nodes, links };
  }, [data]);

  return (
    <div className="h-[600px] bg-gray-900 rounded-lg overflow-hidden">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeColor="color"
        nodeRelSize={6}
        linkColor={() => "#ffffff33"}
        backgroundColor="#111827"
      />
    </div>
  );
} 