import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;

  constructor(private geolocation: Geolocation, public httpClient: HttpClient) { }

  addMarker = function(map, title, position) {
    var marker = new google.maps.Marker({
      title: title,
      snippet: 'tste 123 ',
      icon: { url : 'assets/imgs/marker.png' },
      animation: google.maps.Animation.BOUNCE,
      position: position,
      map: map,
    });
    var infoWindowContent = '<div id="content">' + 
      '<span style="font-face: arial; font-size: 14px; font-weight: bold;">' + 
        marker.title + 
      '</span>' + 
    '</div>';
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
    //return marker;
  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition()
      .then((resp) => {
        const position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

        const mapOptions = {
          zoom: 16,
          center: position
        }

        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        this.addMarker(this.map, "ME", position);

        var places_raio = 50;
        var places_url = 'http://mobile-aceite.tcu.gov.br/mapa-da-saude/rest/estabelecimentos' +
          '/latitude/' + resp.coords.latitude +
          '/longitude/' + resp.coords.longitude +
          '/raio/' + places_raio +
          '?categoria=POSTO%20DE%20SA%C3%9ADE';
        console.log("DEBUG: places_url: ");
        console.log(places_url);
        var places = this.httpClient.get(places_url);
        places.subscribe(data => {

          console.log("DEBUG: places: ");

        
          for(let row of data) {
            console.log(row);
            var row_position = new google.maps.LatLng(row.lat, row.long);
            this.addMarker(this.map, row.nomeFantasia, row_position);
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