import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';


import { O2PaymentStripeComponent } from './src/o2-payment-stripe.component';
import { StripeConsService } from './src/stripe-cons.service';
import { StripeAuthService } from './src/stripe-auth.service';

export * from './src/o2-payment-stripe.component';
export * from './src/stripe-cons.service';
export * from './src/stripe-auth.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    O2PaymentStripeComponent,
  ],
  exports: [
    O2PaymentStripeComponent,
  ]
})
export class SampleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SampleModule,
      providers: [StripeConsService,StripeAuthService]
    };
  }
}
