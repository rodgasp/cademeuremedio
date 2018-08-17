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

  constructor(private geolocation: Geolocation, public httpClient: HttpClient) { 
    this.addMarker = function(map, position) {
      var marker = new google.maps.Marker({
        position: position,
        map: map
      });
      //return marker;
    }
  }

  ionViewDidLoad() {

    this.geolocation.getCurrentPosition()
      .then((resp) => {
        const position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

        const mapOptions = {
          zoom: 18,
          center: position
        }

        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        this.addMarker(this.map, position);

        var places_raio = 50;
        var places_url = 'http://mobile-aceite.tcu.gov.br/mapa-da-saude/rest/estabelecimentos' +
          '/latitude/' + resp.coords.latitude +
          '/longitude/' + resp.coords.longitude +
          '/raio/' + places_raio;
        this.places = this.httpClient.get(places_url);
        this.places.subscribe(data => {
          console.log("this.places:");
          console.log(data);
          for(let row of data) {
            console.log(row);
            var row_position = new google.maps.LatLng(row.lat, row.long);
            this.addMarker(this.map, row_position);
          }
        })

      }).catch((error) => {
        console.log('Erro ao recuperar sua posição', error);
      });
  }
}