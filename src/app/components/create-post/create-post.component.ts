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

    // Clear previous error message
    this.errorMessage = '';

    // Check if the post text is not empty
    if (!this.post.text.trim()) {
      this.errorMessage = 'Post text cannot be empty';
      return;
    }

    // Check if a file is selected
    if (!this.post.image) {
      this.errorMessage = 'You must upload an image';
      return;
    }

    // Proceed with the post creation logic
    console.log('Form submitted', this.post, this.post.image);
    // Add your post submission logic here (e.g., HTTP request)

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
