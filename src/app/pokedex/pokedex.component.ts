import { Component, OnInit } from '@angular/core';
import { PokemoncardComponent } from '../pokemoncard/pokemoncard.component';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../pokemon.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { NavbarComponent } from "../navbar/navbar.component";
@Component({
  selector: 'app-pokedex',
  imports: [PokemoncardComponent, CommonModule, ScrollingModule, NavbarComponent],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss',
  standalone:true
})

export class PokedexComponent implements OnInit {
  pokemonList$!: Observable<any[]>; 

  constructor(public pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemons(); // Load first batch
    this.pokemonList$ = this.pokemonService.pokemons$;
  
  }

  onScroll(event: any): void {
    const target = event.target;

    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {

      this.loadMore();
    }
  }
  selectType(type: string): void {
      this.pokemonService.selectedType = type;
      this.pokemonService.firstSelection = true; // Ensure reset happens
      this.pokemonService.getPokemons();
  }


  loadMore(): void {
    this.pokemonService.getPokemons();

  }

  
}
