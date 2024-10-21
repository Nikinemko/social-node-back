import { Component } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.less'],
})
export class CreatePostComponent {
  post = { text: '', image: null };

  constructor(private postService: PostService) {}

  onFileSelected(event: any) {
    this.post.image = event.target.files[0]; // Store the selected file
  }

  onSubmit() {
    const formData = new FormData();

    if (this.post.image) {
      formData.append('image', this.post.image);
    }
    formData.append('text', this.post.text);

    this.postService.createPost(formData).subscribe(
      (response) => {
        console.log('Post created successfully:', response);
      },
      (error) => {
        console.error('Error creating post:', error);
        console.log(this.post.image);
      }
    );
  }
}
