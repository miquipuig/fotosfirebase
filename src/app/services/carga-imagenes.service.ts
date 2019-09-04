import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { FileItem } from '../models/file-item';
import { async } from '@angular/core/testing';
@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor( private db: AngularFirestore) { }

  // private guardarImagen (imagen: any){
  //   this.db.collection(`/${this.CARPETA_IMAGENES}`)
  //       .add(imagen);
  // }

  private guardarImagen(imagen: { nombre: string, url: string }) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`/${this.CARPETA_IMAGENES}`)
        .add(imagen).then(res => {
          //console.log(res);
          resolve(res);
        }, err => reject(err));
    });
  }

  cargarImagenesFirebase(imagenes: FileItem[]) {
    const storageRef = firebase.storage().ref();

    for ( const item of imagenes) {
        item.estaSubiendo = true;
        if (item.progreso >= 100){
          continue;
        }
        const uploadTask: firebase.storage.UploadTask =
        storageRef.child(`${ this.CARPETA_IMAGENES}/${ item.nombreArchivo }`).put(item.archivo);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snaphot: firebase.storage.UploadTaskSnapshot) => {

            item.progreso = (snaphot.bytesTransferred /  snaphot.totalBytes) * 100;
            // console.log("progress bar" + item.progreso);
          },

          (error) => console.error ('Error al subir: '+ error),
          async () => {
              console.log('Imagen cargada correctamente');
              item.url = await uploadTask.snapshot.ref.getDownloadURL();
              // console.log(item.url);
              item.estaSubiendo = false;
              this.guardarImagen({
                nombre: item.nombreArchivo,
                url: item.url
              } );
          }
        );

    }

   // console.log(imagenes);
  }
}
