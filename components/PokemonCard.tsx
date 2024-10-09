import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image';

interface PokemonCardProps {
  pokemon: {
    id: number;
    name: string;
    sprites: {
      front_default: string;
    };
    height: number;
    weight: number;
    base_experience: number;
    abilities: Array<{
      ability: {
        name: string;
      };
    }>;
  };
  onRemove: () => void;
  onViewFullInfo: () => void;
}

export default function PokemonCard({ pokemon, onRemove, onViewFullInfo }: PokemonCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg capitalize">{pokemon.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <Image
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={120}
            height={120}
            className="pixelated"
          />
        </div>
        <div className="space-y-2 text-sm">
          <p><strong>Height:</strong> {pokemon.height / 10}m</p>
          <p><strong>Weight:</strong> {pokemon.weight / 10}kg</p>
          <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
          <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
        </div>
        <Button 
          className="mt-4 w-full" 
          onClick={onViewFullInfo}
        >
          See Full Info
        </Button>
        <Button 
          variant="destructive" 
          className="mt-2 w-full" 
          onClick={onRemove}
        >
          Remove
        </Button>
      </CardContent>
    </Card>
  );
}