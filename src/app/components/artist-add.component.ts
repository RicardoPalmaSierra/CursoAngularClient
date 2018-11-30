import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserServices } from '../services/user.service';

import { ArtistServices } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserServices, ArtistServices]
})

export class ArtistAddComponent implements OnInit{
    
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userServices: UserServices,
        private _artistServices: ArtistServices
    ){
        this.titulo = "Nuevo Artista";
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');
    }


    ngOnInit(){
        //console.log('artist-add.component cargado');        
    }

    onSubmit(){
        
        this._artistServices.addArtist(this.token, this.artist).subscribe(
            response => {                
                if(!response.artist){
                    alert("Error en el servidor");
                }else{
                    this.alertMessage = "El Artista se ha creado correctamente";
                    this.artist = response.artist;
                    this._router.navigate(['/editar-artista', response.artist._id]);
                }
                   
            },
             error => {
                var errorMessage = <any>error;

                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        this.alertMessage = body.message;
                    }
                }
        );
        
    }
}