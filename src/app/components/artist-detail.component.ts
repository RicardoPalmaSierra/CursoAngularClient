import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserServices } from '../services/user.service';

import { ArtistServices } from '../services/artist.service';
import { AlbumServices } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/Album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserServices, ArtistServices, AlbumServices]
})

export class ArtistDetailComponent implements OnInit{
    
    public titulo: string;
    public artist: Artist;
    public albums: Album[];
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public confirmado = false;
    

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userServices: UserServices,
        private _artistServices: ArtistServices,
        private _albumServices: AlbumServices
    ){
        this.titulo = "Detalle Artista";
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');
        
    }


    ngOnInit(){
        //console.log('artist-add.component cargado');   
        this.getArtist();
    }

    getArtist(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            
            this._artistServices.getArtist(this.token, id).subscribe(
                response =>{                    
                    if(!response.artist){
                        this._router.navigate(['/']);
                    }else{
                        this.artist = response.artist;
                        console.log(response.artist._id);
                        this._albumServices.getAlbums(this.token, response.artist._id).subscribe(
                            response => {
                                if(!response.albums){
                                    this.alertMessage = "Este Artista no tiene Albums";
                                }else{
                                    this.albums = response.albums;
                                }
                            },error => {
                                var errorMessage = <any>error;
                
                                    if(errorMessage != null){
                                        var body = JSON.parse(error._body);
                                        //this.alertMessage = body.message;
                                    }
                            }
                        );
                    }
                },
                error => {
                var errorMessage = <any>error;

                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        //this.alertMessage = body.message;
                    }
                });
                
            
            
        });
    }
    
    onDeleteConfirm(id){
        this.confirmado = id
    }

    onCancelAlbum(){
        this.confirmado = null;
    }

    onDeleteAlbum(id){

        this._albumServices.deleteAlbum(this.token, id).subscribe(
            response => {
                if(!response.album){
                    alert("Error en el servidor");
                }

                this.getArtist();
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
