import { Component } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less'],
})
export class HomepageComponent {
  title: String = 'Cubecaf';
  logged: boolean = this.userService.isLoggedIn();

  constructor(
    private postService: PostService,
    private userService: UserService
  ) {}
}
