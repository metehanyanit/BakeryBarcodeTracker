interface CharacterSheetProps {
  character: Character;
  isEditable?: boolean;
}

export function CharacterSheet({ character, isEditable = false }: CharacterSheetProps) {
  return (
    <div className="bg-parchment min-h-screen p-8 font-medieval">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-lg shadow-2xl p-8 border-2 border-amber-900">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900">{character.name}</h1>
          <div className="flex justify-center items-center gap-4 mt-2 text-amber-800">
            <span>{character.race}</span>
            <span>•</span>
            <span>Level {character.level} {character.class}</span>
            <span>•</span>
            <span>{character.alignment}</span>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8">
          {/* Ability Scores */}
          <div className="space-y-4">
            {Object.entries(character.abilities).map(([ability, score]) => (
              <AbilityScore
                key={ability}
                ability={ability}
                score={score}
                editable={isEditable}
              />
            ))}
          </div>

          {/* Combat Stats */}
          <div className="col-span-2">
            {/* Add combat stats, skills, etc. */}
          </div>
        </div>
      </div>
    </div>
  );
} 