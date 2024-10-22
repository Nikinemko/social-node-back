import { Component } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.less'],
})
export class PostsComponent {
  posts: any[] = []; // Array to hold posts

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  // Fetch posts from the backend
  loadPosts() {
    this.postService.getPosts().subscribe(
      (response) => {
        this.posts = response; // Store posts in the component
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
}
