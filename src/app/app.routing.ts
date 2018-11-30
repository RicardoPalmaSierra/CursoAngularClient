import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Import Home
import { HomeComponent } from './components/home.component';

//Import User
import { UserEditComponent } from './components/user-edit.component';

//Import Artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//Import Album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

//Import Song
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

const appRoutes: Routes = [
    
    {path : '', component: HomeComponent},
    //Rutas Artistas
    {path : 'artistas/:page', component: ArtistListComponent},
    {path : 'crear-artista', component: ArtistAddComponent},
    {path : 'artista/:id', component: ArtistDetailComponent},
    {path : 'editar-artista/:id', component: ArtistEditComponent},
    //Rutas Albums
    {path : 'crear-album/:artist', component: AlbumAddComponent},
    {path : 'editar-album/:album', component: AlbumEditComponent},
    {path : 'album/:album', component: AlbumDetailComponent},

    //Rutas Song
    {path : 'agregar-cancion/:album', component: SongAddComponent},
    {path : 'editar-cancion/:id', component: SongEditComponent},

    //Rutas Usuario
    {path : 'mis-datos', component: UserEditComponent},
    {path : '**', component: HomeComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);    