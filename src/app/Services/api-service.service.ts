import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  data: any;

  baseurl = 'http://localhost:8181';
 

  getEmail() {
    return localStorage.getItem('email');
  }

  getVedioRequestDatav(): Observable<any> {
    return this.http.get<any>(
      `${this.baseurl}/videoRequestData`
    );
  }

  registerCustomer(data: any) {
    // console.log(data);
    return this.http.post<any>(`${this.baseurl}/userRegister`, data);
  }

  updateData(data: any,_id:any) {
    console.log(data);
    return this.http.put<any>(`${this.baseurl}/update/${_id}`, data );
  }

  loginCustomer(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseurl}/userLogin`, data);
  }

  loginAdmin(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseurl}/adminLogin`, data);
  }

  getAllUserData(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}/userData`);
  }

  getPaymentHistory(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}/allHistory`);
  }

  uploadVideo(data: any) {
    return this.http.post(`${this.baseurl}/videoUpload`, data);
  }

  videoRequest(data: any) {
    console.log(data);
    return this.http.post(`${this.baseurl}/videoRequest`, data);
  }

  saveGoogleInfo(data: any) {
    console.log(data);
    return this.http.post(`${this.baseurl}/googleLogin`, data);
  }

  saveFacebookInfo(data: any) {
    console.log(data);
    return this.http.post(`${this.baseurl}/facebookLogin`, data);
  }


  getSingleUser(): Observable<any> {
    this.data = this.getEmail();
    return this.http.get<any>(`${this.baseurl}/user/${this.data}`);
  }

  saveFeedbacks(formData:any) {
    // console.log(formData);
    return this.http.post(`${this.baseurl}/feedback`, formData);
  }

 verifyOtp(formData:any) {
    console.log(formData);
    return this.http.post(`${this.baseurl}/otpVerify`, formData);
  }

  getAllFeedbacks(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}/allFeedbacks`);
  }
  
  RemoveUser(email:string) {
    this.data = this.getEmail();
    return this.http.delete<any>(`${this.baseurl}/user/delete/${email}`);
  }

  generateTokenStep1(data:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.post(
     'https://zoom.us/oauth/token', data, { headers: httpHeaders, observe: 'response' }
    );
  }
}
