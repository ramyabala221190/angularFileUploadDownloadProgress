import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
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

downloadExcel(){
  return this.http.get(`${environment.baseUrl}excel`,{reportProgress:true,observe:'events',responseType:'text'}).pipe(
    tap((response:any)=>{
      if(response.type==HttpEventType.DownloadProgress){ //3
        this.setDownloadingProgress(response.loaded/response.total);
      }
      else if(response.type === HttpEventType.Response){
        let blob = new Blob([response.body]);
        this.downloadBlob(response,blob);
      }
    }),
    catchError(err=>{
      return throwError(err)
    })
  )
}


downloadJson()
{
return this.http.get(`${environment.baseUrl}photos`,{reportProgress:true,observe:'events'}).pipe(
  tap((response:any)=>{
    if(response.type==HttpEventType.DownloadProgress){ //3
      this.setDownloadingProgress(response.loaded/response.total);
    }
    else if(response.type === HttpEventType.Response){
      let blob = new Blob([JSON.stringify(response.body)]);
      this.downloadBlob(response,blob);
    }
  }),
  catchError(err=>{
    return throwError(err)
  })
)
}

downloadBlob(response:any,blob:Blob){
 let substringA=response.headers.get('content-disposition').substring(response.headers.get('content-disposition').indexOf(";")+1);
  let filename= substringA.substring(substringA.indexOf("=")+1).replace(/[""]+/g,"");
  let link = document.createElement('a');
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();
}
}
