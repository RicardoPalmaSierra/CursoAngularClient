import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserServices } from '../services/user.service';
import { ArtistServices } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserServices,ArtistServices]
})

export class ArtistListComponent implements OnInit{
    
    public titulo: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string;
    public next_page;
    public prev_page;
    public confirmado;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userServices: UserServices,
        private _artistServices: ArtistServices
    ){
        this.titulo = "Artistas";
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
        this.confirmado = 0;
        
        //this.artist = new Artist('','','');
    }


    ngOnInit(){
        //console.log('artist-list.component cargado');
        this.getArtists();
    }

    getArtists(){
        
        this._route.params.forEach((params: Params) =>{
            let page = +params['page'];
            
            if(!page){
                page = 1;
            }else{
                this.next_page = page+1;
                this.prev_page = page-1;
                
                if(this.prev_page == 0){
                    this.prev_page = 1;
                }
            }
            
            
            this._artistServices.getArtists(this.token, page).subscribe(
                response =>{                    
                    if(!response.artists){
                        this._router.navigate(['/']);
                    }else{
                        this.artists = response.artists;
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
        this.confirmado = id;
    }

    onDeleteArtist(id){
        //console.log("Token: "+ this.token);
        //console.log("ID: "+ id);
        
        this._artistServices.deleteArtist(this.token, id).subscribe(
            response =>{
                if(!response.artist){
                    alert("Error en el servidor");
                }
                this.getArtists();
            },
            error =>{
                var errorMessage = <any>error;

                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    console.log(body.message);
                    //this.alertMessage = body.message;
                }
            }
        );
        
    }

    onCancelArtist(){
        this.confirmado = null;
    }





}