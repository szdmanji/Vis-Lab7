Promise.all([ // load multiple files
	d3.json('airports.json'),
	d3.json('world-110m.json')
]).then(data=>{ 
	let airports = data[0];
    let worldmap = data[1]; 

    const margin = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 20
    }

    const height = 1000 - margin.top - margin.bottom;
    const width = 600 - margin.right - margin.left;

    const features = topojson.feature(worldmap, worldmap.objects.countries);
    console.log('features', features);
    console.log("worldmap", worldmap);

    const projection = d3.geoMercator()
    .fitExtent([[0,0], [width, height]], features);
    
    const path = d3.geoPath().projection(projection);

    const svg = d3.select('.chart').append('svg')
    .attr('viewBox', [0,0,width,height])

    svg.selectAll("path")
        .data(features)
        .join("path")
        .attr('d', path)
    
    svg.append("path")
        .datum(topojson.mesh(worldmap, worldmap.objects.countries))
        .attr("d", path)
        .attr("fill", "none");
        

   /* const simulation = d3.forceSimulation(airports.nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(airports.links))
        .force("center",d3.forceCenter(width/2, height/2))
        */

});