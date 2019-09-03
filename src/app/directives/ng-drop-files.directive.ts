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
  }

  @HostListener('dragleave',['$event'])
  public onDragLeave( event: any) {
      this.mouseSobre.emit(false);
  }


  //VALIDACIONES

  private _archvioPuedeSerCargado( archivo: File): boolean {
    if (this._archivoYaFueDroppeado(archivo.name) && this._esImagen (archivo.type)){
        return true;
    }else{
      return false;
    }
  }

  private _prevenirDetener( event ){
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueDroppeado( nombreArchivo: string): boolean{
      for( const archivos of this.archivos){
        if(archivos.nombreArchivo === nombreArchivo ){
          console.log('El archivo '+ nombreArchivo + ' ya esta agregado')
          return true;
        }
      }
      return false;
  }

  private _esImagen( tipoArchivo: string): boolean {
    return (tipoArchivo ==='' || tipoArchivo === undefined) ? false: tipoArchivo.startsWith('image');


  }

}
