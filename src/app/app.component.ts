import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserServices } from './services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from './services/global';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [UserServices],
})
export class AppComponent implements OnInit{
    
    public title = 'MUSICA';
    public user: User;
    public new_user: User;
    public identity;
    public token;
    public errorMessage;
    public messageRegister;
    public url;

    constructor(
        private _userServices: UserServices,
        private _router: Router
    ){
        this.user = new User('','','','','','ROLE_USER','');
        this.new_user = new User('','','','','','ROLE_USER','');
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();
    }

    public onSubmit(){
        
        this._userServices.singup(this.user).subscribe(
            response =>{
                //console.log(response);
                let identity = response.user;
                this.identity = identity;
                
                if(!this.identity._id){
                    alert("Usuario mal logueado");
                }else{
                    
                    localStorage.setItem('identity', JSON.stringify(identity));
                    
                    this._userServices.singup(this.user, 'true').subscribe(
                        response =>{
                            //console.log(response);
                            let token = response.token;
                            this.token = token;
                        

                            if(this.token.length <= 0){
                                alert("Problema con el token");
                            }else{
                                localStorage.setItem('token', token);
                                this.user = new User('','','','','','ROLE_USER','');
                            }
                        },
                        error => {
                        var errorMessage = <any>error;

                            if(errorMessage != null){
                                var body = JSON.parse(error._body);
                                this.errorMessage = body.message;
                                console.log(error)
                            }
                        });
                }
            },
            error => {
            var errorMessage = <any>error;
                
                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    this.errorMessage = body.message;
                    console.log(error)
                }
            });
    }

    public onSubmitRegister(){
        
        console.log(this.new_user);
        
        this._userServices.register(this.new_user).subscribe(
            response => {
                let user = response.user;
                
                this.new_user = user;
                
                if(!user._id){
                    this.messageRegister = "Error al crear usuario";
                }else{
                    this.messageRegister = "Usuario "+ user.name + " registrado";
                    this.new_user = new User('','','','','','ROLE_USER','');
                }
            
        }, error =>{
             var errorMessage = <any>error;
                
                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    this.errorMessage = body.message;
                    console.log(error)
                }
        });
        
    }


    logout(){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        this.new_user = new User('','','','','','ROLE_USER','');
        this.user = new User('','','','','','ROLE_USER','');
        this.messageRegister = "";
        this.errorMessage = "";
        localStorage.clear();
        this.identity = null;
        this.token = null;
        this._router.navigate(['/']);
    }
}
