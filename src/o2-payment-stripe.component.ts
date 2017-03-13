

import { Component, OnInit } from '@angular/core';
import { Http, Headers,Response,RequestOptions,Request, RequestMethod } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { StripeConsService } from './stripe-cons.service';
import { StripeAuthService } from './stripe-auth.service';
declare var Stripe:any;

@Component({
  selector: 'o2-payment-stripe',
})
export class O2PaymentStripeComponent implements OnInit{

  private cardToken:any;
  _http: any;
  private _auth:any;
  public _stripeTestSecretKey:any;
  public _stripePublicKey:any;


  constructor(http: Http,private _stripe:StripeConsService,private _stripeAuth:StripeAuthService){
    this._http = http;
    this._auth = _stripeAuth;
  }

  ngOnInit(){
    this._stripeTestSecretKey = this._auth.getTestSecretKey();
    this._stripePublicKey = this._auth.getTestPublicKey();

  }




// private functions -----------------------


  private addSameNameParams(params: any,paramName: string,attrs:string[]): string{
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    let str = "";
    for (var attr in attrs) {
      str += "&" + encodeURIComponent(paramName) + "=" + encodeURIComponent(attrs[attr]);
    }
    bodyUrlEncoded += str;
    return bodyUrlEncoded;
  }


  private getData(url: String): Promise<Response>{
    let headers = new Headers()
    headers = this.getStripeHeaders();
    let options = new RequestOptions({ headers: headers });

    return this._http.get(url,options)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
  }

  private deleteData(url: String): Promise<Response>{
    console.log("delete url-----",url);
    let headers = new Headers()
    headers = this.deleteStripeHeaders();
    let options = new RequestOptions({ headers: headers });

    return this._http.delete(url,options)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
  }



  private sendData(url: String, data?: any): Promise<Response>{
    const body = data;
    let headers = new Headers()
    headers = this.postStripeHeaders();
    let options = new RequestOptions({ headers: headers });
    return this._http.post(url, body ,options)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
    
  }

  private extractData(res:Response) {
    console.log("Success------------");
    return res;
  }

  private handleError(error: Response | any){
    console.log("error------------",error);
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} - ${err.message} - ${err.param}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }

	
	private postStripeHeaders(): Headers{
		let headers = new Headers();
		let access_token = this._stripeTestSecretKey;
    if (access_token) {
        headers.append('Accept','application/json');
        headers.append('Content-Type','application/x-www-form-urlencoded');
        headers.append('Authorization', "Bearer " + access_token);
    }
		return headers;
	}

	private getStripeHeaders(): Headers{
		let headers = new Headers();
		let access_token = this._stripeTestSecretKey;
    if (access_token) {
        headers.append('Accept','application/json');
        headers.append('Authorization', "Bearer " + access_token);
    }
		return headers;
	}

	private deleteStripeHeaders(): Headers{
		let headers = new Headers();
		let access_token = this._stripeTestSecretKey;
    if (access_token) {
        headers.append('Content-Type','application/json');
        headers.append('Authorization', "Bearer " + access_token);
    }
		return headers;
	}

  private getParamsUrlEncoded(params:any){
    let encoded = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      encoded.push(encodedKey + "=" + encodedValue);
    }
    let urlEncoded = encoded.join("&");
    return urlEncoded;
  }


// Common Functions ----------------------------

  private async postWithSubdirCommon(baseUrl:string,id:string,subdir:string){
    let url = baseUrl 
              + "/" + id + "/" + subdir;
    return await this.sendData(url);
  }

  private async getWithSubdirCommon(baseUrl:string,id:string,subdir:string,id2?:string){
    let url = baseUrl + "/" + id + "/" + subdir ;
    if (id2 != null){
      url += "/" + id2 ;
    }
    let bodyUrlEncoded = this.getParamsUrlEncoded(url);
    return await this.sendData(url,bodyUrlEncoded);
  }

  private async reversalCommon(baseUrl:string,id:string){
    return await this.postWithSubdirCommon(baseUrl,id,"reversal");
  }

  private async rejectCommon(baseUrl:string,id:string){
    return await this.postWithSubdirCommon(baseUrl,id,"reject");
  }

  private async closeCommon(baseUrl:string,id:string){
    return await this.postWithSubdirCommon(baseUrl,id,"close");
  }


  private async deleteCommon(baseUrl:string,id:string){
    let url = baseUrl + "/" + id;
    return await this.deleteData(url);
  }

  private async updateCommon(baseUrl:string,id:string,params:string){
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    let url = baseUrl  + "/" + id;
    return await this.sendData(url,bodyUrlEncoded);
  }


  private async retrieveCommon(baseUrl:string,id?:string){
    let url = baseUrl 
    if(id != null){
      url += "/" + id;
    }
    return await this.getData(url);
  }

  private async createCommon(baseUrl:string,params:string,sameName?:string,array?:string[]){
    if (sameName != null && array != null){
      let urlEncodedStr = this.addSameNameParams(params,sameName,array);
      let url = this._stripe.PRODUCTS;
      return  await this.sendData(url,urlEncodedStr);
    }
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    return await this.sendData(baseUrl,bodyUrlEncoded);
  }

  // private async createCommon(baseUrl:string,params:string){
  //   let bodyUrlEncoded = this.getParamsUrlEncoded(params);
  //   return await this.sendData(baseUrl,bodyUrlEncoded);
  // }

  private async listCommon(baseUrl:string,params:string){
    let urlEncoded = this.getParamsUrlEncoded(params);
    let url = baseUrl + "?" + urlEncoded;
    return await this.getData(url);
  }




}
