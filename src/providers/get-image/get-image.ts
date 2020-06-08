import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { RequestInterface } from '../core/core';
import { ServiceProvider } from '../service/service';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

/*
  Generated class for the GetImageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetImageProvider {

  constructor(public http: Http,
              private crop: Crop,
              private service: ServiceProvider,
              private sanitizer: DomSanitizer,
              private base64: Base64,
              private camera: Camera
  ) {
    console.log('Hello GetImageProvider Provider');

  }


  getImage( sourceType: string|number ){

    let optSourceType: number

    if( sourceType == 'file' ){

      optSourceType = this.camera.PictureSourceType.PHOTOLIBRARY
    }else if( sourceType == 'camera' ){

      optSourceType = this.camera.PictureSourceType.CAMERA
    }

    return new Promise( ( resolve, reject ) => {

      const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        sourceType: optSourceType,
        correctOrientation: true,
        mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture( options ).then( imageData => resolve( imageData ), err => reject() );
    })
  }

  cropImgforAvatar( imgURL ){

    return new Promise( ( resolve, reject ) => {

      this.crop.crop( imgURL, { quality: 75 })
          .then( 
            newImage => resolve( newImage ),
            error => reject()
          );
    })
  }

  getBase64Image( imgURL: string ) {

    return new Promise( (resolve, reject) => {

      // let img = document.createElement("img");
      // img.setAttribute('crossOrigin', 'anonymous');
      
      // console.log('iniciou getBase64');
      // img.onload = function() {
        
      //   console.log('carregou');
      //   let canvas = document.createElement("canvas");
      //   canvas.width = img.width;
      //   canvas.height = img.height;
        
      //   let ctx = canvas.getContext("2d");
        
      //   ctx.drawImage( img, 0, 0 );
      //   let dataURL = canvas.toDataURL("image/jpeg");
      //   resolve( dataURL.toString() ) ;
        
      // };

      // img.src = imgURL;

      this.base64.encodeFile(imgURL)
      .then((base64File: any) => {

        base64File = base64File.replace('*;charset=utf-8', 'jpeg')
        resolve(base64File)
      }, (err) => {

        reject(err)
      });

      // let fReader = new FileReader();
      // console.log( 'passou 1')
      // console.log( 'urli', imgURL )
      // fReader.readAsDataURL(imgURL);
      // console.log( 'passou 2')
      // fReader.onloadend = () => {
      // console.log( 'passou 3')

        // resolve( String(fReader.result) );
      // }
    })
    
  }

  getImageSanitizer( imgURLBase64: string ): SafeUrl {

    return  this.sanitizer.bypassSecurityTrustUrl(imgURLBase64)
  } 

  
}
