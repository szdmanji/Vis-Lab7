d3.json('airports.json', d3.autoType).then(data => {
    console.log('Airports', data)

    const margin = {
        top: 100,
        left: 10,
        right: 10,
        bottom: 20
    }

    const height = 600 - margin.top - margin.bottom;
    const width = 600 - margin.right - margin.left;

    const svg = d3.select('.chart')
        .append('svg')
        .attr('viewBox', [0, 0, width, height])

    const circleScale = d3.scaleLinear()
        .domain(d3.extent(data.nodes, d=>d.passengers))
        .range([2,12])

    const simulation = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(data.links))
        .force("center",d3.forceCenter(width/2, height/2))

    let drag = simulation => {
  
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    const links = svg
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke', 'orange')

    const nodes = svg.selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr('class','map')
        .attr('r', d=>circleScale(d.passengers))
        .attr('cx', (d,i)=>(d.x))
        .attr('cy', (d,i)=>(d.y))
        .attr('fill', "orange")
        .call(drag(simulation))


    nodes.append("title")
        .text(d => d.name);
        
    simulation.on("tick", () => {
        links
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    
        nodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        });


});