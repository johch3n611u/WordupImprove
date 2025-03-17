import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PicsumImgService {

  // https://picsum.photos/
  root: string = 'https://picsum.photos';

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * 取得單張寬高照片網址
   *
   * @param {string} width
   * @param {string} [height]
   * @param {boolean} [isRandom=true]
   * @return {*}  {string}
   * @memberof PicsumImgService
   */
  getImageUrl(width: string, height?: string, isRandom: boolean = true): string {
    height = height ? height : width;
    return `${this.root}/${width}/${height}${isRandom ? '?random=' + Math.floor(Math.random() * 1000) : ''}`;
  }

  /**
   * 取得多張照片物件陣列
   *
   * @param {number} count
   * @param {number} [page=0]
   * @return {*}  {Observable<any>}
   * @memberof PicsumImgService
   */
  getImageUrls(count: number, page: number = 0): Observable<any> {
    return this.httpClient.get<string>(`${this.root}/v2/list?page=${page}&limit=${count}`);
  }
}
