"use client"

import { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import PokemonModal from './PokemonModal';

interface Pokemon {
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
}

const STORAGE_KEY = 'pokemonIds';
const POKEMON_DATA_KEY = 'pokemonData';

export default function PokemonList() {
  const [pokemonIds, setPokemonIds] = useState<number[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPokemonName, setNewPokemonName] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved Pokémon IDs and data from localStorage
    const savedIds = localStorage.getItem(STORAGE_KEY);
    const savedData = localStorage.getItem(POKEMON_DATA_KEY);
    if (savedIds) {
      setPokemonIds(JSON.parse(savedIds));
    } else {
      setPokemonIds([25]); // Start with Pikachu
    }
    if (savedData) {
      setPokemons(JSON.parse(savedData));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pokemonIds.length > 0) {
      fetchPokemons();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pokemonIds));
    }
  }, [pokemonIds]);

  const fetchPokemons = async () => {
    setIsLoading(true);
    setError('');
    try {
      const promises = pokemonIds.map(id => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
      );
      const results = await Promise.all(promises);
      setPokemons(results);
      localStorage.setItem(POKEMON_DATA_KEY, JSON.stringify(results));
    } catch (err) {
      setError('Failed to fetch Pokémon data');
    } finally {
      setIsLoading(false);
    }
  };

  const addPokemon = async () => {
    if (!newPokemonName) return;
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${newPokemonName.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokémon not found');
      }
      const data = await response.json();
      if (!pokemonIds.includes(data.id)) {
        setPokemonIds(prev => [...prev, data.id]);
        setPokemons(prev => [...prev, data]);
        localStorage.setItem(POKEMON_DATA_KEY, JSON.stringify([...pokemons, data]));
        toast({
          title: "Pokémon Added",
          description: `${data.name} has been added to the list.`,
        });
      } else {
        toast({
          title: "Pokémon Already in List",
          description: `${data.name} is already in your list.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add Pokémon. Please check the name and try again.",
        variant: "destructive",
      });
    }
    setNewPokemonName('');
  };

  const removePokemon = (id: number) => {
    setPokemonIds(prev => prev.filter(pokemonId => pokemonId !== id));
    setPokemons(prev => prev.filter(pokemon => pokemon.id !== id));
    localStorage.setItem(POKEMON_DATA_KEY, JSON.stringify(pokemons.filter(pokemon => pokemon.id !== id)));
    toast({
      title: "Pokémon Removed",
      description: `The Pokémon has been removed from your list.`,
    });
  };

  const openModal = (pokemon: any) => {
    setSelectedPokemon(pokemon);
  };

  const closeModal = () => {
    setSelectedPokemon(null);
  };

  if (isLoading) return <div className="text-center">Loading Pokémon...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Enter Pokémon name"
          value={newPokemonName}
          onChange={(e) => setNewPokemonName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={addPokemon}>Add Pokémon</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemons.map((pokemon) => (
          <PokemonCard 
            key={pokemon.id} 
            pokemon={pokemon} 
            onRemove={() => removePokemon(pokemon.id)}
            onViewFullInfo={() => openModal(pokemon)}
          />
        ))}
      </div>
      {selectedPokemon && (
        <PokemonModal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </div>
  );
}