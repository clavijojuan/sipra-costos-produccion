import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingInstances: string[] = [];
  loading = new Subject<boolean>();

  private evalLoadingInstances() {
    if (this.loadingInstances.length > 0) {
      this.loading.next(true);
    } else {
      this.loading.next(false);
    }
  }

  private generateRandomKey(length = 20): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  loadingInstance(key: string = ''): string | undefined {
    if (key && this.loadingInstances.includes(key)) {
      const index = this.loadingInstances.findIndex(
        (instance: string) => instance === key
      );
      this.loadingInstances.splice(index, 1);
      this.evalLoadingInstances();
      return;
    } else {
      const keyInstance = this.generateRandomKey();
      this.loadingInstances.push(keyInstance);
      this.evalLoadingInstances();
      return keyInstance;
    }
  }
}
