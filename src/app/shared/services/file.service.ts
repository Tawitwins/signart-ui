import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
 
@Injectable()
export class FileService {
  private fileList: string[] = new Array<string>();
  private fileList$: Subject<string[]> = new Subject<string[]>();
  public displayLoader$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  mydata: any;
  constructor(private http: HttpClient) { }
 
  public isLoading(): Observable<boolean> {
    return this.displayLoader$;
  }
  public isStopped(): boolean {
    return this.displayLoader$.isStopped;
  }
 
  public upload(fileName: string, fileContent: string): any {
    this.displayLoader$.next(true);
    //console.log(fileName);
    //console.log(fileContent);
    return this.http.put(environment.API_ENDPOINT + `admin/files/${fileName}`, fileContent)
    .pipe(finalize(() => this.displayLoader$.next(false)));
    // .subscribe(res => {
    //   this.fileList.push(fileName);
    //   this.fileList$.next(this.fileList);
    //   //console.log(res);
    // }, error => {
    //   this.displayLoader$.next(false);
    // });
  }
 
  public download(fileName: string): any {
    return this.http.get(environment.API_ENDPOINT + `admin/GetFiles/${fileName}`,{responseType:'text'});

    
    // this.http.get('http://localhost:8081/DLfiles/'+fileName,{responseType: 'text'}) .pipe(
    //   tap( // Log the result or error
    //     data => this.log(fileName, data),
    //     error => this.logError(fileName, error)
    //   )
    // );
  }
  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
}
  public remove(fileName): void {
    //console.log(this.mydata);
    this.http.delete(environment.API_ENDPOINT + `admin/${fileName}`).subscribe(() => {
      this.fileList.splice(this.fileList.findIndex(name => name === fileName), 1);
      this.fileList$.next(this.fileList);
    });
  }
 
  public list(): Observable<string[]> {
    return this.fileList$;
  }
 
  private addFileToList(fileName: string): void {
    this.fileList.push(fileName);
    this.fileList$.next(this.fileList);
  }
 }