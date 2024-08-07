import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.less'],
})
export class ProfilePictureComponent {
  selectedFile: File | null = null;
  selectedFileName: string | null | undefined = null;

  constructor(protected userService: UserService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile?.name;
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.userService.uploadProfilePicture(this.selectedFile).subscribe(
        (response) => {
          console.log('Profile picture uploaded successfully', response);
        },
        (error) => {
          console.error('Error uploading profile picture', error);
        }
      );
    }
  }
}
