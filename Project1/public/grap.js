const dims = {height:300, width:300, radius:150}
const cent = {x:dims.width/2 +5,y:dims.height/2 +5}

const svg = d3.select('.canvas')
.append('svg')
.attr('width',dims.width + 150)
.attr('height',dims.height + 150)

const graph = svg.append('g')
.attr('transform',`translate
(${cent.x},${cent.y})`)

const pie = d3.pie()
.sort(null)
.value(d => d.cost)


const arcPath = d3.arc()
.outerRadius(dims.radius)
.innerRadius(dims.radius / 2)

const color = d3.scaleOrdinal(d3['schemeSet3'])

const legendGroup = svg.append('g')
.attr('transform',`translate(${dims.width+40},10)`)

const legend = d3.legendColor()
.shape('circle')
.shapePadding(10)
.scale(color)

const tip = d3.tip()
.attr('class','tip card')
.html(d=>{
    let content = `<div class="name">Name: ${d.data.name}</div>`
    content += `<div class="cost">Cost: ${d.data.cost}$</div>`
    content += `<div class="delete">Click slice to delete</div>`
    return content
})

graph.call(tip)

const update = (data) =>{

    color.domain(data.map(d =>d.name))
    
    legendGroup.call(legend)
    legendGroup.selectAll('text').attr('fill','white')

    const paths = graph.selectAll('path')
    .data(pie(data))

    paths.exit()
    .transition().duration(750)
    .attrTween('d',arcTweenExit)
    .remove()

    paths.attr('d',arcPath)
    .transition().duration(750)
    .attrTween('d',arcTweenUpdate)

    paths.enter()
    .append('path')
    .attr('class','arc')
    .attr('stroke','#fff')
    .attr('stroke-width',3)    
    .attr('fill',d=>color(d.data.name))
    .each(function(d){this._current = d})
    .transition().duration(750)
    .attrTween("d",arcTweenEnter)

    graph.selectAll('path')
    .on('mouseover',(d,i,n)=>{
        tip.show(d,n[i])
    })
    .on('mouseout',(d,i,n)=>{
        tip.hide()
    })
    .on('click',handleClick)

}

var data = []

db.collection('expenses').onSnapshot(res=>{
    res.docChanges().forEach(change=>{
        const doc = {...change.doc.data(),id:change.doc.id}

        switch(change.type){
            case 'added':
                data.push(doc)
                break
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id)
                data[index] = doc
                break
            case 'removed':
                data = data.filter(item => item.id !== doc.id)
                break
            default:
                break
        }

    })

    update(data)
})

const arcTweenEnter = d =>{
    var i = d3.interpolate(d.endAngle,d.startAngle)

    return function(t){
        d.startAngle = i(t)
        return arcPath(d)
    }
}
const arcTweenExit = d =>{
    var i = d3.interpolate(d.startAngle,d.endAngle)

    return function(t){
        d.startAngle = i(t)
        return arcPath(d)
    }
}

function arcTweenUpdate(d) {
    var i = d3.interpolate(this._current,d)

    return function(t){
        d = i(t)
        return arcPath(d)
    }
}

const handleClick = (d,i,n) =>{
    const id = d.data.id
    db.collection('expenses').doc(id).delete()
}
