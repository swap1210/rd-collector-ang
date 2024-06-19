import { Injectable, computed, inject, signal } from '@angular/core';
import { CommonUtil } from '../util/common-util';
import { CommModel } from '../../model/comm.model';
import { toObservable } from '@angular/core/rxjs-interop';
import { FIRESTORE } from '../../app.config';
import { AuthenticationService } from '../../services/authentication.service';
import { doc, onSnapshot } from 'firebase/firestore';

interface MetadataState {
  commModel: CommModel;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CommonUtilService {
  private firestore = inject(FIRESTORE);
  // private authenticationService = inject(AuthenticationService);
  // private authUser$ = toObservable(this.authenticationService.user);

  // source
  // metadata$ = this.getFirebaseMetaData().pipe(
  //   // restart stream when user reauthenticate
  //   retry({ delay: () => this.authUser$.pipe(filter((user) => !!user)) })
  // );

  // state
  private state = signal<MetadataState>({
    commModel: {
      img: {
        whatsapp_logo: '',
      },
      mera_commission: {
        commission_rate: 0,
        tds_rate: 0,
      },
    },
    error: null,
  });

  metadataSignal = computed(() => this.state().commModel);

  errorSignal = computed(() => {
    return this.state().error;
  });

  constructor() {
    const unsub = onSnapshot(
      doc(
        this.firestore,
        CommonUtil.firebaseMetaData.collectionName,
        CommonUtil.firebaseMetaData.documentId
      ),
      (doc) => {
        console.log('Current data: ', doc.data());
        this.state.update((state) => ({
          ...state,
          commModel: doc.data() as CommModel,
        }));
      }
    );
  }

  getImages = (pImgKey: string): string => {
    return CommonUtil.tempImgGallery[pImgKey];
  };
}
