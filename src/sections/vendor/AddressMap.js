import React, { useState, useEffect, useRef, setQuery } from 'react'
import { Loader } from '@googlemaps/js-api-loader';

import mapStyle from './../../helpers/mapStyle';
import { InputAdornment, TextField, IconButton, Tooltip, Button, Box } from '@mui/material';
import Iconify from './../../components/Iconify';
import { LoadingButton } from '@mui/lab';
import axios from '../../axios/axiosinstance';



function AddressMap({ vendorId, updated, callback }) {

    var mapAddress = null
    const [formSubmited, setFormSubmited] = useState(false)
    const ref = useRef();

    const loader = new Loader({
        apiKey: "AIzaSyDVmLxJagzx2MGSJ58SPiL3WXD-x4QPtf4&libraries",
        version: "weekly",
        libraries: ["places"],
    });
    const mapOptions = {
        center: {
            lat: 50.4501, lng: 30.5234
        },
        zoom: 8
    }
    loader
        .load()
        .then((google) => {
            const map = new google.maps.Map(document.getElementById("formMap"), mapOptions);
            const infoWindow = new google.maps.InfoWindow();

            // marker
            map.setOptions({ styles: mapStyle() });
            let marker = new google.maps.Marker({
                position: map.getCenter(),
                draggable: false,
                map: map,
                icon: "https://i.ibb.co/CnyjXqk/marker.png",

            })
            google.maps.event.addListener(map, 'drag', function () {
                marker.setPosition(map.getCenter());
                const markerLat = marker.getPosition().lat();
                const markerLng = marker.getPosition().lng();
                let address, resultArray
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ latLng: marker.getPosition() }, function (result, status) {
                    if ('OK' === status) {  // This line can also be written like if ( status == google.maps.GeocoderStatus.OK ) {
                        address = result[0].formatted_address;
                        resultArray = result[0].address_components;
                        input.value = address

                        mapAddress = { addressString: address, latitude: markerLat, longitude: markerLng }
                        ref.current.removeAttribute("style")
                        var city
                        // Get the city and set the city input value to the one selected
                        for (var i = 0; i < resultArray.length; i++) {
                            if (resultArray[i].types[0] && 'administrative_area_level_2' === resultArray[i].types[0]) {
                                city = resultArray[i].long_name;

                            }
                        }

                    } else {
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }
                });

            });



            // searbox******

            const input = document.getElementById("mapSearchBox");
            const searchBox = new google.maps.places.SearchBox(input);

            google.maps.event.addListener(searchBox, 'places_changed', function () {

                var places = searchBox.getPlaces(),
                    bounds = new google.maps.LatLngBounds(),
                    i, place, lat, long, resultArray,
                    address = places[0].formatted_address;
                for (i = 0; place = places[i]; i++) {
                    bounds.extend(place.geometry.location);
                    marker.setPosition(place.geometry.location);  // Set marker position new.

                }

                map.fitBounds(bounds);  // Fit to the bound
                map.setZoom(20); // This function sets the zoom to 15, meaning zooms to level 15.
                lat = marker.getPosition().lat();
                long = marker.getPosition().lng();
                map.setCenter(new google.maps.LatLng(lat, long));
                map.setMapTypeId('satellite')
                places = map.getPlaces

                if (infoWindow) {
                    infoWindow.close();
                }

                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ latLng: marker.getPosition() }, function (result, status) {
                    if ('OK' === status) {  // This line can also be written like if ( status == google.maps.GeocoderStatus.OK ) {
                        address = result[0].formatted_address;
                        resultArray = result[0].address_components;
                        input.value = address
                        var city

                        mapAddress = { addressString: address, latitude: lat, longitude: long }
                        ref.current.removeAttribute("style")

                        // Get the city and set the city input value to the one selected
                        for (var i = 0; i < resultArray.length; i++) {
                            if (resultArray[i].types[0] && 'administrative_area_level_2' === resultArray[i].types[0]) {
                                city = resultArray[i].long_name;

                            }
                        }
                    } else {
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }
                });
            });


            var locationButton = document.getElementById("currentLocationBtn")
            locationButton.addEventListener("click", () => {



                // Try HTML5 geolocation.
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            marker.setPosition(pos);

                            map.setZoom(20); // This function sets the zoom to 15, meaning zooms to level 15.
                            let lat = marker.getPosition().lat();
                            let long = marker.getPosition().lng();
                            map.setCenter(new google.maps.LatLng(lat, long));
                            map.setMapTypeId('satellite')

                            let address, resultArray, city
                            var geocoder = new google.maps.Geocoder();
                            geocoder.geocode({ latLng: marker.getPosition() }, function (result, status) {
                                if ('OK' === status) {  // This line can also be written like if ( status == google.maps.GeocoderStatus.OK ) {
                                    address = result[0].formatted_address;
                                    input.value = address
                                    mapAddress = { addressString: address, latitude: lat, longitude: long }
                                    ref.current.removeAttribute("style")
                                    resultArray = result[0].address_components;

                                    // Get the city and set the city input value to the one selected
                                    for (var i = 0; i < resultArray.length; i++) {
                                        if (resultArray[i].types[0] && 'administrative_area_level_2' === resultArray[i].types[0]) {
                                            city = resultArray[i].long_name;

                                        }
                                    }

                                } else {
                                    console.log('Geocode was not successful for the following reason: ' + status);
                                }
                            });




                        },
                        () => {
                            handleLocationError(true, infoWindow, !map.getCenter());
                        }
                    );
                } else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, infoWindow, !map.getCenter());
                }
            });

            function handleLocationError(
                browserHasGeolocation,
                infoWindow,
                pos
            ) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(
                    browserHasGeolocation
                        ? "Error: The Geolocation service failed."
                        : "Error: Your browser doesn't support geolocation."
                );
                infoWindow.open(map);
            }
        })
        .catch(e => {

            // do something
        });

    const saveLocationHandler = () => {

        if (mapAddress && mapAddress.addressString && mapAddress.latitude && mapAddress.longitude) {
            setFormSubmited(true)
            let addBody = {
                vendor_id: vendorId,
                addressess: [
                    {
                        latitude: mapAddress.latitude.toString(),
                        longitude: mapAddress.longitude.toString(),
                        addressString: mapAddress.addressString
                    }
                ]
            }


            var config = {
                method: 'post',
                url: 'admin/vendor/addresses/add',

                data: addBody
            };
            axios(config).then((reponse) => {
                updated(vendorId)
                setFormSubmited(false)
                callback(reponse.data)

            }).catch(function (error) {
                callback({})
            });
        }
    }

    return (
        <div>

            <div style={{ padding: "20px" }}>
                <TextField
                    placeholder='Enter your address'
                    id="mapSearchBox" fullWidth type="seacrh" label="Search"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Current location" arrow>
                                    <IconButton id='currentLocationBtn'>
                                        <Iconify icon="bx:current-location" />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>)
                    }}
                />


                <LoadingButton
                    loading={formSubmited}
                    onClick={saveLocationHandler}
                    fullWidth
                    sx={{ my: 2, p: 1.8 }}
                    style={{ pointerEvents: "none", opacity: ".2" }}
                    ref={ref}

                    id="addressSaveBtn"
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                >
                    Save Address
                </LoadingButton>

            </div>
            <div style={{ width: "100%", height: "400px" }} id='formMap'></div>
        </div>
    )
}

export default AddressMap