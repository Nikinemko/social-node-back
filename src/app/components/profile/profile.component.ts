import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit {
  profile: any;
  profilePictureUrl: SafeUrl | null = null;

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe(
      (data) => {
        console.log(data);
        this.profile = data;
      },
      (err) => {
        console.error(err);
      }
    );
    this.userService.getProfilePicture().subscribe(
      (response: Blob) => {
        console.log('response: ', response);
        const objectURL = URL.createObjectURL(response);
        console.log('ObjectURL: ', objectURL);
        this.profilePictureUrl =
          this.sanitizer.bypassSecurityTrustUrl(objectURL);
        console.log('sanitizer profile url: ', this.profilePictureUrl);
      },
      (error) => {
        console.error('Error retrieving profile picture:', error);
      }
    );
  }
}
