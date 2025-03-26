import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';

export type PokemonType = 
  | "normal" | "fire" | "water" | "electric" | "grass" 
  | "ice" | "fighting" | "poison" | "ground" | "flying" 
  | "psychic" | "bug" | "rock" | "ghost" | "dragon" 
  | "dark" | "steel" | "fairy";

  
export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
  species: [];
  stats:[];
  base_experience: number;
}
    
@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiurl = 'https://pokeapi.co/api/v2'; 
  private offset = 0;
  private limit = 100;
  public selectedType = "";
  public firstSelection = false;
  public isLoading = false;

  private pokemons = new BehaviorSubject<Pokemon[]>([]);
  public pokemons$ = this.pokemons.asObservable();
  public pokemonTypes = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
  ]

  constructor(private http: HttpClient) {}


  
private resetPokemonList(): void {
  this.pokemons.next([]); 
  this.offset = 0;
  this.firstSelection = false;
  }
  
  getPokemons(): void {
    this.isLoading = true;
  if (this.selectedType) {
    if (this.firstSelection) {
       this.resetPokemonList();
    } else {
      this.isLoading = false;
      return;
    }
  }

  let url = `${this.apiurl}${this.selectedType !== '' ? `/type/${this.selectedType}` : '/pokemon'}?offset=${this.offset}&limit=${this.limit}`;

  this.http.get<any>(url).pipe(
    catchError(error => {
      console.error('Error fetching Pokémon list:', error);
      return of({ pokemon: [], results: [] }); // Ensure valid structure
    }),
    switchMap((response: any) => {
      let pokemonList = this.selectedType !== '' ? response.pokemon.map((p: any) => p.pokemon.url) : response.results.map((p: any) => p.url);

      if (pokemonList.length === 0) return of([]);

      return forkJoin(pokemonList.map((pokeUrl: string) => this.http.get<any>(pokeUrl))) as Observable<any[]>;
    }),
    map((pokemonDetails: any[]) => 
      pokemonDetails.map((pokemon: any) => ({
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other['official-artwork'].front_default,
        types: pokemon.types.map((t: any) => t.type.name),
        base_experience: pokemon.base_experience,
        species: pokemon.species,
        stats: pokemon.stats,
      }))
    )
  )
  .subscribe(pokemons => {
    const currentList = this.pokemons.getValue();
    this.pokemons.next([...currentList, ...pokemons]); // Append new results
    this.offset += this.limit; // Update offset for pagination
    this.isLoading = false;
  });
}

}