import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {Post} from './post.model';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postCreated = new Subject();
  errorSubject = new Subject();

  constructor(private httpClient: HttpClient) {
  }

  createAndStorePost(title: string, content: string) {
    return this.httpClient
      .post(
        'https://recipe-app-23c12.firebaseio.com/posts.json',
        {title, content}
      ).subscribe(() => this.postCreated.next(),
        (error) => {
          this.errorSubject.next(error.message);
        });
  }

  fetchPosts() {
    return this.httpClient.get<{ [key: string]: Post }>('https://recipe-app-23c12.firebaseio.com/posts.json').pipe(map(response => {
      const postArray: Post[] = [];
      // tslint:disable-next-line:forin
      for (const key in response) {
        if (response.hasOwnProperty(key)) {
          postArray.push({...response[key], id: key});
        }
      }
      return postArray;
    }));
  }

  deletePosts() {
    return this.httpClient.delete('https://recipe-app-23c12.firebaseio.com/posts.json');
  }
}
