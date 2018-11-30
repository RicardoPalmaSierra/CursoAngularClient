import { Component, OnInit } from '@angular/core';

import { UserServices } from '../services/user.service';
import { User } from '../models/user';

import { GLOBAL } from '../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserServices]
})

export class UserEditComponent implements OnInit{
    
    public titulo: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public url: string;

    constructor(
        private _userServices: UserServices
    ){
        
        this.titulo = 'Actualizar mis datos';
        //this.user = new User('','','','','','ROLE_USER','');
        
        //localStorage
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        
    }

    onSubmit(){
        console.log(this.user);
        
        this._userServices.updateUser(this.user).subscribe(
            response => {                
                if(!response.user){
                    this.alertMessage = "Usuario no ha podido actualizarse";
                }else{
                    //this.user = response.user;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById('username').innerHTML = this.user.name;
                    
                    if(!this.filesToUpload){
                        
                    }else{
                        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[], this.filesToUpload).then(
                            (result: any)=>{
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));
                                let image_path = this.url + 'get-image-user/'+ this.user.image;
                                document.getElementById('user-image-logged').setAttribute('src', image_path);
                                
                            }
                        );
                    }
                    
                    
                    this.alertMessage = "Usuario actualizado correctamente";
                }
            },
            error => {
                var errorMessage = <any>error;

                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        this.alertMessage = body.message;
                        //console.log(error)
                    }
                });
            
        
    }

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any){
        
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        var token = this.token;
        
        return new Promise(function(resolve, reject){
            var formData: any = new FormData();
            
            var xhr = new XMLHttpRequest();
            
            for(var i = 0; i < files.length; i++){
                formData.append('image', files[i], files[i].name);
            }
            
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                       resolve(JSON.parse(xhr.response));
                    }else{
                       reject(xhr.response) ;
                    }
                }
            }
                
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
    
    
}