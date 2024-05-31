import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  private uploadingProgressSub = new Subject();

  getUploadingProgress() {
    return this.uploadingProgressSub.asObservable();
  }

  setUploadingProgress(data: any) {
    this.uploadingProgressSub.next(data);
  }


  uploadPhoto(photo: any) {
    var formdata: FormData = new FormData();
    formdata.append("uploads", photo);
    return this.http.post(`${environment.baseUrl}uploadPhoto`, formdata, { reportProgress: true, observe: 'events' }).pipe(
      tap((event: any) => {
        if (event.type == HttpEventType.UploadProgress) //1
        {
          this.setUploadingProgress({ ratio: event.loaded / event.total, name: photo.name, size: photo.size });
        }
      })
    );
  }
}
