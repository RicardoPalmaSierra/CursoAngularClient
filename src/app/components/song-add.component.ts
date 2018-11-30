import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserServices } from '../services/user.service';

import { AlbumServices } from '../services/album.service';
import { SongServices } from '../services/song.service';

import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserServices, AlbumServices, SongServices]
})

export class SongAddComponent implements OnInit{
    
    public titulo: string;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userServices: UserServices,
        private _albumServices: AlbumServices,
        private _songServices: SongServices
    ){
        this.titulo = "Nueva Canción";
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1,'', '' ,'','');
        
    }


    ngOnInit(){
        //console.log('artist-add.component cargado'); 
        this.getNameAlbum();
    }

    getNameAlbum(){

        this._route.params.forEach((params: Params)=>{
            
            let album_id = params['album'];
            this.song.album = album_id;
            this._albumServices.getAlbum(this.token, album_id).subscribe(
                response =>{
                    if(!response.album){
                        alert("error al traer album");
                    }else{
                        this.titulo = "Agregar canción para " + response.album.title ;
                    }

                },error =>{
                    var errorMessage = <any>error;
                    
                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        this.alertMessage = body.message;
                    }
                                    
                }
            );
        });
    }

    onSubmit(){
        
        

        this._route.params.forEach((params: Params)=>{

            let album_id = params['album'];
            this.song.album = album_id;

            this._songServices.addSong(this.token, this.song).subscribe(
                response => {
                    if(!response.song){
                        alert("Error al guardar canción");
                    }else{
                        this.alertMessage = "La canción se ha agregado correctamente";
                        this.song = response.song;
                        this._router.navigate(['/editar-cancion/', response.song._id]);
                    }

                },error =>{
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