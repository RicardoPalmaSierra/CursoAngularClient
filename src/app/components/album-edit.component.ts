import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserServices } from '../services/user.service';

import { AlbumServices } from '../services/album.service';
import { UploadServices } from '../services/upload.service';

import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-edit.html',
    providers: [UserServices, AlbumServices,UploadServices ]
})


export class AlbumEditComponent implements OnInit{
    
    public titulo: string;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userServices: UserServices,
        private _albumServices: AlbumServices,
        private _uploadService: UploadServices
    ){
        this.titulo = "Editar Album";
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','',2017,'','');
        this.is_edit = true;
        
    }

    ngOnInit(){
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
                        this.titulo = "Editar album de "+ response.album.artist.name
                        this.album = response.album;
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

    
    public filesToUpload: Array<File>;
    
    
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    onSubmit(){
        
        this._route.params.forEach((params: Params)=>{
            let album_id = params['album'];
            
            this._albumServices.editAlbum(this.token, album_id, this.album).subscribe(
                response =>{
                    if(!response.album){
                        this.alertMessage = "Error en el servidor";
                    }else{
                        this.alertMessage = "Album actualizado!!!";

                        if(!this.filesToUpload){
                            this._router.navigate(['/artista', response.album.artist]);
                        }else{
                            //Subir fichero de imagen
                            this._uploadService.makeFileRequest(this.url+'upload-image-album/'+album_id, [], this.filesToUpload, this.token, 'image').then(
                                (result)=>{                                    
                                    this._router.navigate(['/artista', response.album.artist]);
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

}