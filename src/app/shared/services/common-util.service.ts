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
  private authenticationService = inject(AuthenticationService);
  private authUser$ = toObservable(this.authenticationService.user);

  // source
  // metadata$ = this.getFirebaseMetaData().pipe(
  //   // restart stream when user reauthenticate
  //   retry({ delay: () => this.authUser$.pipe(filter((user) => !!user)) })
  // );

  // state
  state = signal<MetadataState>({
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

  metadataSignal = computed(() => {
    this.state().commModel;
  });

  errorSignal = computed(() => {
    this.state().error;
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

  // getFirebaseMetaData() {
  //   return new Observable<MetadataState>((subscriber) => {
  //     const unsub = onSnapshot(
  //       doc(
  //         this.firestore,
  //         CommonUtil.firebaseMetaData.collectionName,
  //         CommonUtil.firebaseMetaData.documentId
  //       ),
  //       (documentFetched) => {
  //         const source = documentFetched.metadata.hasPendingWrites
  //           ? 'Local'
  //           : 'Server';
  //         console.log(source, ' data: ', documentFetched.data());
  //         subscriber.next({
  //           commModel: documentFetched.data() as CommModel,
  //           error: null,
  //         });
  //       },
  //       (error) => {
  //         subscriber.error(error);
  //       }
  //     );

  //     // Unsubscribe function
  //     return () => unsub();
  //   });
  // }

  // private updateState(commModel: CommModel, error: string | null) {
  //   this.state.update((state) => ({ ...state, commModel, error }));
  // }
}

// private metadata = signal<CommModel>({
//   img: {
//     whatsapp_logo: '',
//   },
//   mera_commission: {
//     commission_rate: 0,
//     tds_rate: 0,
//   },
// });

// metadata = toSignal(
//   this.FetchObservableData<CommModel>(CommonUtil.firebaseMetaData.documentId),
//   {
//     initialValue: {
//       img: {
//         whatsapp_logo: '',
//       },
//       mera_commission: {
//         commission_rate: 0,
//         tds_rate: 0,
//       },
//     },
//   }
// );
//   }
// }

//   this.FetchObservableData<CommModel>(CommonUtil.firebaseMetaData.documentId),
//   {
//     initialValue: {
//       img: {
//         whatsapp_logo: '',
//       },
//       mera_commission: {
//         commission_rate: 0,
//         tds_rate: 0,
//       },
//     },
//   }
// );
