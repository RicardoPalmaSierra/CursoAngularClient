import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserServices } from '../services/user.service';

import { ArtistServices } from '../services/artist.service';
import { UploadServices } from '../services/upload.service';
import { AlbumServices } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-edit.html',
    providers: [UserServices, ArtistServices, UploadServices, AlbumServices]
})

export class ArtistEditComponent implements OnInit{
    
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _uploadService: UploadServices,
        private _userServices: UserServices,
        private _artistServices: ArtistServices,
        private _albumServices: AlbumServices 
    ){
        this.titulo = "Editar Artista";
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');
        this.is_edit = true;
        
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

    onSubmit(){
        
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            
            this._artistServices.editArtist(this.token, id ,this.artist).subscribe(
            response => {                
                if(!response.artist){
                    alert("Error en el servidor");
                }else{
                    this.alertMessage = "El Artista se ha actualizado correctamente";
                    
                    //Subir imagen del artista
                    
                    if(!this.filesToUpload){
                        this._router.navigate(['/artista', response.artist._id]);
                    }else{
                        this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id, [], this.filesToUpload, this.token, 'image').then(
                            (result)=>{
                                this._router.navigate(['/artistas', 1]);
                            },
                            (error)=>{
                                console.log(error);
                            }
                        );
                   }
                    //this.artist = response.artist;
                    //this._router.navigate()
                }
                   
            },
             error => {
                var errorMessage = <any>error;

                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        this.alertMessage = body.message;
                    }
                });
        });
        
        
    }

    public filesToUpload: Array<File>;


    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        
    }

    
}