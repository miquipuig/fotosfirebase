import { FileItem } from './../models/file-item';
import { Directive, EventEmitter, ElementRef, HostListener, Input, Output} from '@angular/core';


@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {
  @Input() archivos: FileItem[]=[];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover',['$event'])
  public onDragEnter( event: any) {
      this.mouseSobre.emit(true);
      this._prevenirDetener(event);
  }

  @HostListener('dragleave',['$event'])
  public onDragLeave( event: any) {
      this.mouseSobre.emit(false);
  }

  @HostListener('drop',['$event'])
  public onDrop( event: any) {
      this.mouseSobre.emit(false);
      const transferencia = this._getTransferencia(event);
      if (!transferencia) {
      return;
    }
      this._extraerArchivos(transferencia.files);
      this._prevenirDetener(event);
      this.mouseSobre.emit(false);
  }



  private _getTransferencia(event: any) {
      return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archviosLista: FileList){
      // console.log(archviosLista);

      // tslint:disable-next-line:forin
      for (const propiedad in Object.getOwnPropertyNames(archviosLista)) {
          const archivoTemporal: File = archviosLista[propiedad];
          // console.log(archivoTemporal);
          if (this._archvioPuedeSerCargado(archivoTemporal)) {
            const nuevoArchivo = new FileItem( archivoTemporal );
            this.archivos.push(nuevoArchivo);
          }

      }
      //console.log(this.archivos);

  }


  //VALIDACIONES

  private _archvioPuedeSerCargado( archivo: File): boolean {
    if (!this._archivoYaFueDroppeado(archivo.name) && this._esImagen (archivo.type)) {
        return true;
    } else {
      return false;
    }
  }

  private _prevenirDetener( event ) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueDroppeado( nombreArchivo: string): boolean {
      for ( const archivos of this.archivos) {
        if ( archivos.nombreArchivo === nombreArchivo ) {
          console.log('El archivo ' + nombreArchivo + ' ya esta agregado' );

          return true;
        }
      }
      return false;
  }

  private _esImagen( tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');


  }

}
