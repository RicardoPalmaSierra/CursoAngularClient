import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserServices } from '../services/user.service';

import { AlbumServices } from '../services/album.service';
import { SongServices } from '../services/song.service';
import { UploadServices} from '../services/upload.service';

import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-edit.html',
    providers: [UserServices, AlbumServices, SongServices, UploadServices]
})

export class SongEditComponent implements OnInit{
    
    public titulo: string;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit = true;
    public filesToUpload;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userServices: UserServices,
        private _albumServices: AlbumServices,
        private _uploadServices: UploadServices,
        private _songServices: SongServices
    ){
        this.titulo = "Editar Canción";
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1,'', '' ,'','');
        
    }


    ngOnInit(){
        //console.log('artist-add.component cargado'); 
        this.getSong();
    }

    getSong(){

        this._route.params.forEach((params: Params)=>{    
            let song_id = params['id'];

            this._songServices.getSong(this.token, song_id).subscribe(
                response =>{
                    if(!response.song){
                        this._router.navigate(['/']);
                    }else{
                        this.song = response.song;
                        this.titulo += " " + response.song.name;
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

            let song_id = params['id'];
            

            this._songServices.editSong(this.token, song_id, this.song).subscribe(
                response => {
                    if(!response.song){
                        alert("Error al guardar canción");
                    }else{
                        
                        if(!this.filesToUpload){
                            this._router.navigate(['/album', response.song.album]);
                        }else{
                            //Subir fichero de audio    
                            this._uploadServices.makeFileRequest(this.url+'upload-file-song/'+song_id, [], this.filesToUpload, this.token, 'file').then(
                                (result)=>{                                    
                                    this._router.navigate(['/album', response.song.album]);
                                },
                                (error)=>{
                                    console.log(error);
                                }
                            
                            );
                        }
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


    fileChangeEvent(fileInput: any){

        this.filesToUpload = <Array<File>>fileInput.target.files;

    }



}