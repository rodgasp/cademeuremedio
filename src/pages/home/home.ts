import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { PostoSaude } from './postosaude';
import {NavController} from 'ionic-angular';
import { Renderer } from '@angular/core';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  infoWindows: any;
  initialMarker: any;
  search: string;
  items: any;
  filtereditems:any;
  showSugest: any;
  error: string;

  constructor(private geolocation: Geolocation, public httpClient: HttpClient, public renderer : Renderer) {
    this.filtereditems=[];
  }

  selectItem = function(selectItem){
    console.log("selectItem!");
    console.log(selectItem);
    this.search = selectItem.remedio;
    console.log(this.searchBar);
    this.showSugest = false;
  }

  filterItems = function(){
    if(this.search==''){
          this.showSugest = false;
    }else{
      this.showSugest = true;
      var drugs_url = 'http://cademeuremedio.herokuapp.com/lista/' + this.search;
      var drugs = this.httpClient.get(drugs_url);
      drugs.subscribe(data => {
        if(data.length>0){
          if(!data[0].ERROR){
            console.log("returned data:");
            console.log(data);
            this.filtereditems = data;
          }else{
            console.log('returned error:');
            console.log(data[0].ERROR);
            this.showSugest = false;
            this.error = data[0].ERROR;
          }
        }
      });
    }
  }

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
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "visibility": "off"
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
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "visibility": "off"
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
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]
/*[
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
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "visibility": "off"
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
          ]*/
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
