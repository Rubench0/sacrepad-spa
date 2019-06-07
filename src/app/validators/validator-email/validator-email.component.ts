import { Directive } from "@angular/core";
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: 'emailvalidator',
  providers: [{provide: NG_VALIDATORS, useExisting: ValidatorEmail, multi: true}]
})
class ValidatorEmail implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return { 'custom': true };
  }
}