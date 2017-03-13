import { Injectable } from '@angular/core';

@Injectable()
export class StripeAuthService {

  constructor() { }
	
  public isLogin(): boolean {
      // you need to check login or not
    return true;
  }

  public getRole(): any {
      // you need to check the role
    return 'admin';
  }

  public getTestSecretKey(): any{
    if (this.isLogin && this.getRole() == 'admin'){
      // you need to get this token from secured server
      return "sk_test_rMXxjihD48UaKkhkZOZeUu2z";
    }
  }

  public getTestPublicKey(): any{
    if (this.isLogin && this.getRole() == 'admin'){
      // you need to get this token from secured server
      return "pk_test_43JRel8PZxr00sCQOUm3I4CY";
    }
  }
  
  
}
