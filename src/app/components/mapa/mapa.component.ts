import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
// Importa la biblioteca de Google Maps
declare var google: any;
import { GooglePlaceDirective } from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  @ViewChild("inputOrigen") inputOrigen!: ElementRef;
  @ViewChild("inputDestino") inputDestino!: ElementRef;
  mapa!: google.maps.Map;
  @ViewChild('mapa') mapaRef!: ElementRef;

  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit() {
    this.initMap();
    
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.mapa);

    const autocompleteOrigen = new google.maps.places.Autocomplete(this.inputOrigen.nativeElement);
    autocompleteOrigen.addListener('place_changed', () => {
      this.ngZone.run(() => {
        // Aquí puedes obtener la ubicación seleccionada para el origen
        // Ejemplo: const place = autocompleteOrigen.getPlace();
      });
    });

    const autocompleteDestino = new google.maps.places.Autocomplete(this.inputDestino.nativeElement);
    autocompleteDestino.addListener('place_changed', () => {
      this.ngZone.run(() => {
        // Aquí puedes obtener la ubicación seleccionada para el destino
        // Ejemplo: const place = autocompleteDestino.getPlace();
      });
    });
  }

  calcularRuta() {
    
    const origen = this.inputOrigen.nativeElement.value;
    const destino = this.inputDestino.nativeElement.value;
    // console.log(origen);
    // console.log(destino);


    const request: google.maps.DirectionsRequest = {
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING
    };
    this.directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(response);        

        console.log(response);

        const distanciaTotal = this.calcularDistanciaTotal(response);
      console.log('Distancia total:', distanciaTotal, 'km');
        
      } else {
        window.alert('No se encontró una ruta para los puntos especificados');
      }
    });

  }

  ngOnInit(): void {
    // this.initMap();
    // this.calcularRuta2('Llambí Campbell, Santa Fe, Argentina','San Justo, Santa Fe, Argentina');
  }

  initMap(): void {
    this.mapa = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  }

  

// En tu componente Angular


calcularDistanciaTotal(response: google.maps.DirectionsResult): number {
  let distanciaTotal = 0;

  const route = response.routes[0];
  for (const leg of route.legs) {
    distanciaTotal += leg.distance.value; // Sumar la distancia de cada tramo
  }

  // Convertir la distancia a kilómetros y retornarla
  return distanciaTotal / 1000; // Convertir de metros a kilómetros
}


calcularRuta2(origen: string, destino: string) {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  directionsRenderer.setMap(this.mapa);

  const request = {
    origin: origen,
    destination: destino,
    travelMode: google.maps.TravelMode.DRIVING // Puedes cambiar el modo de viaje según tus necesidades
  };

  directionsService.route(request, (result: any, status: any) => {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
    } else {
      window.alert('Error al calcular la ruta: ' + status);
    }
  });
}


  
}