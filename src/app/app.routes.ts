import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pokedex/pokedex.component').then((m)=> m.PokedexComponent)
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'pokedex',
        loadComponent: () => import('./pokedex/pokedex.component').then((m) => m.PokedexComponent)
    }
];
