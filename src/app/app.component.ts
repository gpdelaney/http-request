import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Post} from './post.model';
import {PostService} from './post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;

  constructor(private postService: PostService) {
  }

  ngOnInit() {
    this.onFetchPosts();
    this.postService.postCreated.subscribe(() => this.onFetchPosts());
    this.postService.errorSubject.subscribe( error => this.error = error);
  }

  onCreatePost(postData: { title: string; content: string }) {
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe((posts) => {
      this.loadedPosts = posts;
      this.isFetching = false;
    }, (error) => {
      this.error = error.message;
      this.isFetching = false;
    });
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe((data) => {
        this.onFetchPosts();
      }, (error) => {
        this.error = error.message;
        this.isFetching = false;
      }
  );
  }

  ngOnDestroy(): void {
    this.postService.errorSubject.unsubscribe();
    this.postService.postCreated.unsubscribe();
  }

  onHandleError() {
    this.error = null;
  }
}
