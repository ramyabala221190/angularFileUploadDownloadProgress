import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor(private http:HttpClient) { }

private downloadingProgressSub=new Subject();

getDownloadingProgress(){
return this.downloadingProgressSub.asObservable();
}

setDownloadingProgress(data:any)
{
this.downloadingProgressSub.next(data);
}


downloadJson()
{
return this.http.get(`${environment.baseUrl}photos`,{reportProgress:true,observe:'events'}).pipe(
  tap((event:any)=>{
    if(event.type==HttpEventType.DownloadProgress){ //3
      this.setDownloadingProgress(event.loaded/event.total);
    }
  })
)
}
}
