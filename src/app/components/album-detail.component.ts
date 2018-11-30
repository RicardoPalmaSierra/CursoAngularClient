import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserServices } from '../services/user.service';

import { SongServices } from '../services/song.service';
import { AlbumServices } from '../services/album.service';
import { GLOBAL } from '../services/global';
// import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserServices, AlbumServices, SongServices]
})

export class AlbumDetailComponent implements OnInit{
    
    public titulo: string;
    // public artist: Artist;
    public album: Album;
    public songs: Song[];
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public confirmado;
    

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userServices: UserServices,
        private _songServices: SongServices,
        private _albumServices: AlbumServices
    ){
        this.titulo = "Detalle Album";
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','',2017,'','');
        
    }


    ngOnInit(){
        //console.log('artist-add.component cargado');   
        this.getAlbum();
    }

    getAlbum(){
        
        this._route.params.forEach((params: Params)=>{
            let album_id = params['album'];

            this._albumServices.getAlbum(this.token, album_id).subscribe(
                response =>{
                    if(!response.album){
                        this._router.navigate(['/']);
                    }else{
                        this.album = response.album;
                        //Sacar canciones

                        this._songServices.getSongs(this.token, response.album._id).subscribe(
                            response =>{
                                if(!response.songs){
                                    this.alertMessage = "Este Album no tiene canciónes"
                                }else{
                                    this.songs = response.songs;
                                }
                            },error =>{
                                var errorMessage = <any>error;
                                
                                if(errorMessage != null){
                                    var body = JSON.parse(error._body);
                                    this.alertMessage = body.message;
                                }
                                                
                            }
                        );
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


    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onCancelSong(){
        this.confirmado = null;
    }

    onDeleteSong(id){
        this._songServices.deleteSong(this.token, id).subscribe(
            response =>{
                if(!response.song){
                    alert("Error en el servidor");
                }else{
                    this.getAlbum();
                }
            },error =>{
                var errorMessage = <any>error;
                
                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    this.alertMessage = body.message;
                }
                                
            }
        );
    }


    startPlayer(song){
        let song_player = JSON.stringify(song);        
        let file_path = this.url + 'get-file-song/' + song.file;
        let image = this.url + 'get-image-album/' + song.album.image;

        localStorage.setItem('sound_song', song_player);

        console.log(file_path);
        

        document.getElementById('mp3-source').setAttribute("src", file_path);
        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute('src', image);
        
        (document.getElementById('player') as any).load();
        (document.getElementById('player') as any).play();
    }

}