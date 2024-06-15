import { Injectable } from '@angular/core';
import { CommonUtil } from './common-util';
import { firebaseApp } from '../firebase-config';
import {
  DocumentData,
  DocumentSnapshot,
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonUtilService {
  private firebaseDefaultDatabaseFirestore = getFirestore(firebaseApp);
  constructor() {
    if (environment.isLocal) {
      connectFirestoreEmulator(
        this.firebaseDefaultDatabaseFirestore,
        '127.0.0.1',
        8080
      );
    }
  }

  getComm = (): Observable<any> => {
    return this.getObservableDocumentForCollectionAndDocument(
      CommonUtil.firebaseMetaData.collectionName,
      CommonUtil.firebaseMetaData.documentId
    ).pipe((data) => {
      return data;
    });
  };

  getImages(pImgKey: string): string {
    return CommonUtil.tempImgGallery[pImgKey];
  }

  getFirebaseMetaData(): any {
    return CommonUtil.firebaseMetaData;
  }

  getObservableDocumentForCollectionAndDocument = (
    collectionName: string,
    documentId: string
  ): Observable<any> => {
    return new Observable((observer) => {
      const documentRef = doc(
        this.firebaseDefaultDatabaseFirestore,
        collectionName,
        documentId
      );
      const unsubscribe = onSnapshot(
        documentRef,
        (snapshot) => {
          if (snapshot.exists()) {
            observer.next({
              // id: snapshot.id,
              ...snapshot.data(),
            });
          } else {
            observer.error(new Error('Document does not exist'));
          }
        },
        (error) => {
          observer.error(error);
        }
      );

      return { unsubscribe };
    });
  };
}
