function Map ({ state }) {
    return (
      <div id="map" className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
              {state.lattitude === "" || state.longitude === "" || Number.isNaN(state.lattitude) || Number.isNaN(state.longitude) ?
                  navigator.geolocation.getCurrentPosition(position => {
                      const {latitude, longitude} = position.coords;
                      // map.innerHTML = '<iframe width="700" height="300" src="https://maps.google.com/maps?q=' 
                      // + latitude + ',' + longitude + '&amp;z=15&amp;output=embed"></iframe>';
                      map.innerHTML = '<iframe width="500" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox='
                      + longitude + '%2C' + latitude + '&amp;layer=mapnik" style="border: 1px solid black"></iframe>';
                  }) : 
                  navigator.geolocation.getCurrentPosition(position => {
                      // map.innerHTML = '<iframe width="700" height="300" src="https://maps.google.com/maps?q=' 
                      // + parseFloat(state.lattitude) + ',' + parseFloat(state.longitude) + '&amp;z=15&amp;output=embed"></iframe>';
                      map.innerHTML = '<iframe width="500" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox='
                      + parseFloat(state.longitude) + '%2C' + parseFloat(state.lattitude) + '&amp;layer=mapnik" style="border: 1px solid black"></iframe>';
                  })
              }
          </div>
      </div>
    );
  };
   
  export default Map;