import { Component, OnInit } from '@angular/core';
import emailjs from '@emailjs/browser';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { ApiService } from '../Services/api-service.service';
declare var Razorpay: any;


@Component({
  selector: 'app-register-interface',
  templateUrl: './register-interface.component.html',
  styleUrls: ['./register-interface.component.css'],
})
export class RegisterInterfaceComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service: ApiService,
    private router: Router,
    // private sharedService:SharedService
  ) {}


  data: any;
  userBookedSlot:any;
  billAmount:any;
  userEmail:any;
  customerName:any;
  MobileNo:any;
  readyToVerify:boolean=false;
  isLoading: boolean = false;


  navigateToRegister(){
    this.router.navigateByUrl('/register');
  }

  ngOnInit(): void {
    // this.sharedService.currentToken.subscribe((GeneretedId: string) => {
    //   this.userBookedSlot = GeneretedId;
    // });

    // console.log(this.userBookedSlot);
  }

  // "studentName": null,
  // "yearOfStudy": null,
  // "address": null,
  // "demoTime": null,
  // "email": "sktiwari1125@gmail.com",
  // "phoneNo": null,
  // "totalAmount": null,
  // "bookedSlot": null,
  // "paymentHistory": null

  registrationForm = this.fb.group({
    studentName: ['', [Validators.required, Validators.minLength(5)]],
    totalAmount: ['12000', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    yearOfStudy: [''],
    address: [''],
    demoTime: [''],
    phoneNo: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
        ),
      ],
    ]
  });

  get studentName() {
    return this.registrationForm.get('studentName');
  }
  get yearOfStudy() {
    return this.registrationForm.get('yearOfStudy');
  }
  get address() {
    return this.registrationForm.get('address');
  }
  get demoTime() {
    return this.registrationForm.get('demoTime');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get phoneNo() {
    return this.registrationForm.get('phoneNo');
  }
  get totalAmount() {
    return this.registrationForm.get('totalAmount');
  }
  // get bookedSlot() {
  //   return this.registrationForm.get('bookedSlot');
  // }

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(4)]]
  })
  get otp() {
    return this.otpForm.get('otp');
  }

  checkData(){
    // console.log(this.readyToVerify);

    if( this.readyToVerify==false){
      this.readyToVerify=true;
    }
    else{
      this.readyToVerify=false;
    }
  }

  verifydata() { 
      this.isLoading=true;
   
  
    this.service
      .registerCustomer({
        studentName: this.studentName?.value,
        email: this.email?.value,
        phoneNo: this.phoneNo?.value,
        totalAmount:this.totalAmount?.value,
        yearOfStudy:this.yearOfStudy?.value,
        demoTime:this.demoTime?.value,
        address:this.address?.value
      })
      .subscribe(
        (data) => {
          console.log(data);
          localStorage.setItem('email',data.email);
          this.billAmount=data.totalAmount;
          this.userEmail=data.email;
          this.customerName=data.studentName;
          this.MobileNo=data.phoneNo;

          this.readyToVerify=true;
          Swal.fire({
            title:
              'Otp Send on your registered Email!',
            showClass: {
              popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp',
            },
          });
          // this.paymentStart();
          // this.send();
          this.registrationForm.reset();
          this.isLoading=false;
          // this.route.navigateByUrl('/login');
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
          this.isLoading=false;
        }
      );
  }

  verifyOtp() { 
    this.service
      .verifyOtp({
        otp: this.otp?.value,
      })
      .subscribe(
        (data) => {
          console.log(data);

          // this.readyToVerify=true;
          Swal.fire({
            title:
              'OTP Verified',
            showClass: {
              popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp',
            },
          });
          this.paymentStart();
          // this.send();
          this.otpForm.reset();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Enter Correct OTP!',
          });
        }
      );
  }

  async send(){
    emailjs.init('-gTT_FrwJfkh1js-B');
   let response = await emailjs.send("service_2fjea4f","template_ii6fto9" ,{
      from_name:'Admin',
      to_name:this.registrationForm.value.studentName,
      form_email:this.registrationForm.value.email,
      totalAmount:this.registrationForm.value.totalAmount,
      subject:'Admin Greetings',
      message:'Thank You For Using Our Service'
    });
  }


  paymentStart(){
    console.log("payment started --")
    let amount= this.billAmount;
    console.log(amount);
  
  $.ajax(
    {
      url:'http://localhost:8181/payment/create_order/'+(this.userEmail),
      data:JSON.stringify({amount:amount,info:'order_request'}),
      contentType:'application/json',
      type:'POST',
      dataType:'json',
      success:function(response){
        console.log(response);
  
        if(response.status=="created"){
  
          let options={
            key:'rzp_test_LP91fzOg59Pohi',
            amount:response.amount,
            currency:'INR',
            name:'Admin Payment Gateway',
            description:'No Worries its Secure Payment',
            image:'https://png.pngtree.com/png-vector/20190114/ourmid/pngtree-vector-payment-icon-png-image_313445.jpg',
            order_id:response.id,
            "handler": function (response: { razorpay_payment_id: any; razorpay_order_id: any; razorpay_signature: any; }){
  
              console.log(response.razorpay_payment_id);
              console.log(response.razorpay_order_id);
              console.log(response.razorpay_signature);
  
              // console.log("payment successfull !!");
              // alert("Hurray ! Payment Done");
              updatePaymentOnServer(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                "paid"
                );
            
              Swal.fire(
                'Payment Done',
                'Your Order placed check your mail for order information',
                'success'
              )
          
             
          },
          prefill:{
  
            name:this.customerName,
  
            email:this.userEmail,
  
            contact:this.MobileNo
  
          },
          notes:{
            address:"India MP"
          },
          theme:{
            color:"#3399cc"
          }
    
          };
  
          var rzp = new Razorpay(options);
          // this.emptycart();
  
         rzp.on('payment.failed',function(response: { error: { code: any; description: any; source: any; step: any; reason: any; metadata: { order_id: any; }; payment_id: any; }; }){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id)
            alert(response.error.payment_id)
            alert("Oops payment failed !!!!!!")
         })
           rzp.open();

        }
      },
    
       error:function(error){
         console.log(error)
         alert("sonthing went wrong !!")
       }
    }
  )
    function updatePaymentOnServer(payment_id:any,order_id:any,status:any) 
    {
      $.ajax(
        {
          url:'http://localhost:8181/payment/update_order',
          data:JSON.stringify({payment_id:payment_id,order_id:order_id,statu:status}),
          contentType:'application/json',
          type:'POST',
          dataType:'json',
          success:function(response){
            console.log(response);
            Swal.fire('Hey user!', 'Updation Success', 'success');
          },
          error:function (error){
            Swal.fire('Hey user!', 'Updation Failed', 'info');
          },
          });
    }
  
  };
}


