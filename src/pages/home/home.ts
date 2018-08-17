import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { Platform } from 'ionic-angular';
//import { mapStyle } from './mapStyle';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  infoWindows: any;

  constructor(private geolocation: Geolocation, public httpClient: HttpClient, public platform: Platform) { }

  closeAllInfoWindows = function (map) {
    if(this.infoWindows){
      for(let infoWindow of this.infoWindows) {
        infoWindow.close();
      }
    }
  }

  addMarker = function(map, title, position, info) {
    // if(!info){
    //   info = ['','',''];
    // }
    var marker = new google.maps.Marker({
      title: title,
      icon: { url : 'assets/imgs/marker.png' },
      animation: 4,
      position: position,
      map: map,
    });
    var infoWindowContent = '<div id="content" style= "max-width: 90%;">' + 
      '<span style="font-face: arial; font-size: 14px; font-weight: bold;">' + 
        title + '</span><br/><span style="font-face: arial; font-size: 14px;">';
    var i = 0;
    if(info){
      for(let row of info) {
        if(row){
          infoWindowContent+= row + '<br/>';
          i++;
        }
      }
    }
    infoWindowContent+='</span><hr style="width: 90%;" />_<hr style="width: 90%;" />_' + 
    '</div>';
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    marker.addListener('click', () => {
      this.closeAllInfoWindows(this.map);
      infoWindow.open(this.map, marker);
      if(!this.infoWindows){
        this.infoWindows = [];
      }
      this.infoWindows.push(infoWindow);
    });
    //return marker;
  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition()
      .then((resp) => {
        const position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

        const mapOptions = {
          zoom: 16,
          center: position,
          fullscreenControlOptions: false,
          mapTypeControl: false,
          streetViewControl: false,
        }

        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        this.addMarker(this.map, "ME", position, false);

        var places_raio = 50;
        var places_url = 'http://mobile-aceite.tcu.gov.br/mapa-da-saude/rest/estabelecimentos' +
          '/latitude/' + resp.coords.latitude +
          '/longitude/' + resp.coords.longitude +
          '/raio/' + places_raio +
          '?categoria=POSTO%20DE%20SA%C3%9ADE';
        //console.log("DEBUG: places_url: ");
        //console.log(places_url);
        var places = this.httpClient.get(places_url);
        places.subscribe(data => {
          //console.log("DEBUG: places: ");
          if(!(this.platform.is('cordova') && 
            (this.platform.is('ios') || this.platform.is('android')))){
            // for(let row of data) {
            //   console.log(row);
            //   var row_position = new google.maps.LatLng(row.lat, row.long);
            //   var info = [ 
            //       //(row.tipoUnidade + ' - ' + row.esferaAdministrativa),
            //       (row.logradouro + ', ' + row.numero),
            //       (row.bairro),
            //       (row.telefone?row.telefone:''),
            //       (row.turnoAtendimento),
            //       //(row.cidade + ' - ' + row.uf)
            //   ];
            //   console.log(info);
            //   this.addMarker(this.map, row.nomeFantasia, row_position, info);
            // }
          }
        },
        err => {
          console.log("Error occured.")
        })
      }).catch((error) => {
        console.log('Erro ao recuperar sua posição', error);
      });
  }
}