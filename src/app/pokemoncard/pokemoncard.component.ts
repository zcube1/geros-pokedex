import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-pokemoncard',
  imports: [CommonModule],
  templateUrl: './pokemoncard.component.html',
  styleUrl: './pokemoncard.component.scss'
})
export class PokemoncardComponent {
  @Input() pokemon: any;
  


}
