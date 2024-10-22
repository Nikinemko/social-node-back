import { Component } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.less'],
})
export class CreatePostComponent {
  post = { text: '', image: null };
  message: string = '';
  errorMessage: string = '';

  constructor(private postService: PostService) {}

  onFileSelected(event: any) {
    this.post.image = event.target.files[0]; // Store the selected file
  }

  onSubmit() {
    const formData = new FormData();
    this.errorMessage = '';
    if (!this.post.text.trim()) {
      this.errorMessage = 'Post text cannot be empty';
      return;
    }

    if (!this.post.image) {
      this.errorMessage = 'You must upload an image';
      return;
    }

    if (this.post.image) {
      formData.append('image', this.post.image);
    }
    formData.append('text', this.post.text);

    this.postService.createPost(formData).subscribe(
      (response) => {
        console.log('Post created successfully:', response);
        this.message = 'Post created!!!';
        this.post.text = '';
        this.post.image = null;
      },
      (error) => {
        console.error('Error creating post:', error);
        console.log(this.post.image);
        this.message = 'There is mistake in creating your post';
      }
    );
  }
}
