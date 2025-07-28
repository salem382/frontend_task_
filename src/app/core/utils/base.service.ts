import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class BaseService {

  protected destroy$: Subject<void> = new Subject<void>();

  // isLoading: boolean = false;

  // protected handleRequestLoading<T>(request$: Observable<T>, setLoading: boolean = true): Observable<T> {
  //   if (setLoading) {
  //     this.isLoading = true;
  //   }
    
  //   return request$.pipe(
  //     finalize(() => {
  //       if (setLoading) {
  //         this.isLoading = false;
  //       }
  //     })
  //   );
  // }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
