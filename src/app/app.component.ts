import { Component, ElementRef, ViewChild } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EMPTY, Observable, catchError, forkJoin, from, fromEvent, fromEventPattern, mergeMap, tap, throwError } from 'rxjs';
import { FileDownloadService } from './file-download.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

constructor(private fileuploadService:FileUploadService,private filedownloadService:FileDownloadService) { }


@ViewChild("photoselector") photoselector:ElementRef | undefined;


imageList:any[]=[];
downloadprogressRatio$:Observable<any>|undefined;
fileUpload=new FormGroup({
  imageSelector:new FormControl("",[Validators.required])
})

ngOnInit() {
this.fileuploadService.getUploadingProgress().pipe(
  tap((result:any)=>{
    let entry=this.imageList.find(x=>x.name === result.name);
    entry ? entry.ratio = result.ratio: null;
  })
).subscribe();
this.downloadprogressRatio$=this.filedownloadService.getDownloadingProgress();
}


preview(event:any){ 
  //preview an image
Array.from(event.target.files).forEach((file:any,fileIndex:number)=>{
  const reader=new FileReader(); //a new reader object for each file
  fromEvent(reader,'load').subscribe((loadEvent:any)=>{
    this.imageList.push({file:loadEvent.target.result,ratio:0,name:file.name,size:file.size}); //display the image once reader's load event is triggered
    console.log(this.imageList)
  })
   reader?.readAsDataURL(file);
})
}


openBrowse(event:any){ //reselecting an image
this.photoselector?.nativeElement.click();
}

upload(event:any){ //upload the previewed images
let obsv$:Observable<any>[]=
Array.from(this.photoselector?.nativeElement.files).map(
  (file:any,fileIndex:number)=>this.fileuploadService.uploadPhoto(file).pipe(catchError(err=>{console.log(err);return EMPTY;})));

forkJoin(obsv$).subscribe((result)=>{
  console.log(result)
});

}

download(){
this.filedownloadService.setDownloadingProgress(0);
this.filedownloadService.downloadJson().subscribe();
}

}

