import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PokemonModalProps {
  pokemon: any;
  onClose: () => void;
}

export default function PokemonModal({ pokemon, onClose }: PokemonModalProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const playCry = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const renderSprites = () => {
    const spriteUrls = [
      { url: pokemon.sprites.front_default, label: 'Front Default' },
      { url: pokemon.sprites.back_default, label: 'Back Default' },
      { url: pokemon.sprites.front_shiny, label: 'Front Shiny' },
      { url: pokemon.sprites.back_shiny, label: 'Back Shiny' },
      { url: pokemon.sprites.front_female, label: 'Front Female' },
      { url: pokemon.sprites.back_female, label: 'Back Female' },
      { url: pokemon.sprites.front_shiny_female, label: 'Front Shiny Female' },
      { url: pokemon.sprites.back_shiny_female, label: 'Back Shiny Female' },
    ].filter(sprite => sprite.url !== null);

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {spriteUrls.map((sprite, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image
              src={sprite.url}
              alt={`${pokemon.name} ${sprite.label}`}
              width={100}
              height={100}
              className="pixelated"
            />
            <span className="text-xs text-center mt-1">{sprite.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold capitalize mb-2">{pokemon.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="space-y-6 p-4">
            <div className="flex flex-col items-center">
              <Image
                src={pokemon.sprites.front_default}
                alt={`${pokemon.name} front`}
                width={200}
                height={200}
                className="pixelated"
              />
              <audio ref={audioRef} src={`https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.mp3`} />
              <Button onClick={playCry} className="mt-2">
                Play Cry
              </Button>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Sprites</h3>
              {renderSprites()}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Height: {pokemon.height / 10} m</li>
                <li>Weight: {pokemon.weight / 10} kg</li>
                <li>Base Experience: {pokemon.base_experience}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Types</h3>
              <div className="flex space-x-2">
                {pokemon.types.map((type: any) => (
                  <Badge key={type.type.name} variant="secondary" className="capitalize">
                    {type.type.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Abilities</h3>
              <ul className="list-disc list-inside">
                {pokemon.abilities.map((ability: any) => (
                  <li key={ability.ability.name} className="capitalize">
                    {ability.ability.name} {ability.is_hidden && <span className="text-sm text-gray-500">(Hidden)</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Stats</h3>
              <ul className="space-y-1">
                {pokemon.stats.map((stat: any) => (
                  <li key={stat.stat.name} className="flex items-center">
                    <span className="w-32 capitalize">{stat.stat.name}:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(stat.base_stat / 255) * 100}%` }}></div>
                    </div>
                    <span className="ml-2">{stat.base_stat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Moves</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.moves.slice(0, 10).map((move: any) => (
                  <Badge key={move.move.name} variant="outline" className="capitalize">
                    {move.move.name}
                  </Badge>
                ))}
              </div>
              {pokemon.moves.length > 10 && (
                <p className="text-sm text-gray-500 mt-2">And {pokemon.moves.length - 10} more moves...</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}