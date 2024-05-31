import { Component, ElementRef, Input, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  @Input('ratio') ratio:number|null=0;
  progress:string="";
  
  ngOnChanges(changes:SimpleChange){
  this.progress=`${this.ratio ? Math.round(this.ratio*100) : 0}%`;
  }
}
