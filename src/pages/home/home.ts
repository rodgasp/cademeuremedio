import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { PostoSaude } from './postosaude';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  infoWindows: any;
  initialMarker: any;

  constructor(private geolocation: Geolocation, public httpClient: HttpClient) { }

  resetCenter = function(){
    console.log('recenter');
    console.log(this.initialMarker.getPosition());
    this.map.setCenter(this.initialMarker.getPosition())
  }

  closeAllInfoWindows = function () {
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
      icon: { url : (title=='ME'?'assets/imgs/marker-me.png':'assets/imgs/marker.png') },
      animation: 4,
      position: position,
      map: map
    });
    if(title!='ME'){
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
        this.closeAllInfoWindows();
        infoWindow.open(this.map, marker);
        if(!this.infoWindows){
          this.infoWindows = [];
        }
        this.infoWindows.push(infoWindow);
      });
    }else{
      this.initialMarker = marker;
    }
    //return marker;
  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition()
      .then((resp) => {
        const position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

        const mapOptions = {
          zoom: 16,
          center: position,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ visibility: "off" }]
            },
            {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.government",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "poi.place_of_worship",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.sports_complex",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
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

        
          for(let row of <PostoSaude[]>data) {
            //console.log(row);
            var row_position = new google.maps.LatLng(row.lat, row.long);
            var info = [ 
                //(row.tipoUnidade + ' - ' + row.esferaAdministrativa),
                (row.logradouro + ', ' + row.numero),
                (row.bairro),
                (row.telefone?row.telefone:''),
                (row.turnoAtendimento),
                //(row.cidade + ' - ' + row.uf)
            ];
            //console.log(info);
            this.addMarker(this.map, row.nomeFantasia, row_position, info);
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
