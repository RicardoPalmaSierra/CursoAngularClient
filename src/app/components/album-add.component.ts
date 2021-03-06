import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserServices } from '../services/user.service';

import { AlbumServices } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserServices, AlbumServices]
})

export class AlbumAddComponent implements OnInit{
    
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userServices: UserServices,
        private _albumServices: AlbumServices
    ){
        this.titulo = "Agregar Album";
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','',2017,'','');
        
    }


    ngOnInit(){
        //console.log('artist-add.component cargado');   
    }

    onSubmit(){

        this._route.params.forEach((params: Params)=>{
            let artist_id = params['artist'];
            this.album.artist = artist_id;

            this._albumServices.addAlbum(this.token, this.album).subscribe(
                response => {                
                    if(!response.album){
                        alert("Error en el servidor");
                    }else{
                        this.alertMessage = "El Album se ha creado correctamente";
                        this.album = response.album;
                        this._router.navigate(['/editar-album', response.album._id]);
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
        });
    }
}
