
let map_width = 950;
let map_height = 500
let margin = ({ top: 0, right: 0, bottom: 0, left: 0 });

let dot_opacity = .7;

let race_filters = [
  "pop_asian_combo",
  "pop_american_indian_combo",
  "pop_black_combo",
  "pop_hispanic_combo",
  "pop_native_hawaiian_pacific_islander_combo",
  "pop_white_combo"
];

function hex_to_rgb_array(c) {
  let rgb = d3.color(c);
  return [rgb.r, rgb.g, rgb.b];
}

let race_color = {
  pop_white_combo: hex_to_rgb_array("#E74F2A"),
  pop_black_combo: hex_to_rgb_array("#00835D"),
  pop_american_indian_combo: hex_to_rgb_array("#234FBF"),
  pop_hispanic_combo: hex_to_rgb_array("#BB3534"),
  pop_asian_combo: hex_to_rgb_array("#3BA0BF"),
  pop_native_hawaiian_pacific_islander_combo: hex_to_rgb_array("#7658A2")
};


function update_asian_checkbox() {
  if (d3.select("#asian").property("checked")) {
    race_filters.push('pop_asian_combo');
    const layer = new deck.ScatterplotLayer({
      data: map_dta.filter(d => race_filters.includes(d.variable)),
      getPosition: (d) => [+d.lon, +d.lat],
      getColor: (d) => race_color[d.variable],
      getRadius: 300,
      opacity: 0.7
    })
    deck.setProps([layer]);

  } else {
    const index = race_filters.indexOf('pop_asian_combo');
    if (index > -1) { // only splice array when item is found
      race_filters.splice(index, 1); // 2nd parameter means remove one item only
      const layer = new deck.ScatterplotLayer({
        data: map_dta.filter(d => race_filters.includes(d.variable)),
        getPosition: (d) => [+d.lon, +d.lat],
        getColor: (d) => race_color[d.variable],
        getRadius: 300,
        opacity: 0.7
      })
      deck.setProps([layer]);
    }
  }
}

function render() {

    Promise.all([
      d3.csv("data/dots_100p_all_rural_2020.csv")
    ]).then(function(files) {

      const deckgl = new deck.DeckGL({
        container: 'container',
        map: mapboxgl,
        mapStyle: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        initialViewState: {
          longitude: -96,
          latitude: 38,
          zoom: 3.7,
          pitch: 0,
          bearing: 0
        },
        controller: true,
        layers: []
      });

      console.log(deckgl);

      const new_layer = new deck.ScatterplotLayer({
        data: files[0].filter(d => race_filters.includes(d.variable)),
        getPosition: (d) => [+d.lon, +d.lat],
        getColor: (d) => race_color[d.variable],
        getRadius: 300,
        opacity: 0.7
      })

      deckgl.setProps({ layers:  new_layer  });

      d3.select("#white")
        .on("change", function(d) {
          if (d3.select("#white").property("checked")) {
            race_filters.push("pop_white_combo");
            const new_layer = new deck.ScatterplotLayer({
              data: files[0].filter(d => race_filters.includes(d.variable)),
              getPosition: (d) => [+d.lon, +d.lat],
              getColor: (d) => race_color[d.variable],
              getRadius: 300,
              opacity: 0.7
            })

            deckgl.setProps({ layers:  new_layer  });
          }
          else {
            let var_index = race_filters.indexOf("pop_white_combo");
            if (var_index > -1) {race_filters.splice(var_index, 1)};
            const new_layer = new deck.ScatterplotLayer({
              data: files[0].filter(d => race_filters.includes(d.variable)),
              getPosition: (d) => [+d.lon, +d.lat],
              getColor: (d) => race_color[d.variable],
              getRadius: 300,
              opacity: 0.7
            })

            deckgl.setProps({ layers:  new_layer  });
          }
        });


  }).catch(function(err) {
      // handle error here
  })
}

render()

d3.selectAll('input[type="checkbox"]')
  .on("keypress", function(d) {
    if (+d.which === 13) {
      //this.checked = !this.checked;
      $(this).click();
    }
  })

