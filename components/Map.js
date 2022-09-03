const Map = ({ state, query }) => {
    const renderMap = (longitude, latitude) => {
        return '<iframe width="500" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox='
        + parseFloat(longitude) + '%2C' + parseFloat(latitude) + '&amp;layer=mapnik" style="border: 1px solid black"></iframe>';
    }
    return (
      <div id="map" className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            {!query ?
                state.lattitude === "" || state.longitude === "" || isNaN(state.lattitude) || isNaN(state.longitude) ?
                    navigator.geolocation.getCurrentPosition(position => {
                        const {latitude, longitude} = position.coords;
                        map.innerHTML = renderMap(longitude, latitude);
                    }) : 
                    navigator.geolocation.getCurrentPosition(position => {
                        map.innerHTML = renderMap(state.longitude, state.lattitude);
                    })
                 :
                navigator.geolocation.getCurrentPosition(position => {
                    map.innerHTML = renderMap( query.longitude, query.latitude);
                })
            } 
          </div>
      </div>
    );
  };
   
  export default Map;

/*
 * If you need Google Maps, use this code snippet
 */
// navigator.geolocation.getCurrentPosition(position => {
//     const {latitude, longitude} = position.coords;
//     map.innerHTML = '<iframe width="700" height="300" src="https://maps.google.com/maps?q=' 
//     + latitude + ',' + longitude + '&amp;z=15&amp;output=embed"></iframe>';
// })