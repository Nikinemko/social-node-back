import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less'],
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get formControls() {
    return this.registrationForm?.controls;
  }

  onSubmit(): void {
    console.log('onSubmit');
    this.submitted = true;

    if (this.registrationForm?.invalid) {
      return;
    }

    if (this.registrationForm.valid) {
      this.userService.register(this.registrationForm.value).subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Registration error', error);
        }
      );
    }
  }
}
