const parseNA = string => (string === 'NA' ? undefined : string);
//日期處理
const parseDate = string => d3.timeParse('%Y-%m-%d')(string);

/*
budget: "42150098"
genre: "Animation"
genres: "[{\"id\": 16, \"name\": \"Animation\"}, {\"id\": 35, \"name\": \"Comedy\"}, {\"id\": 10751, \"name\": \"Family\"}]"
homepage: "http://toystory.disney.com/toy-story"
id: "862"
imdb_id: "tt0114709"
original_language: "en"
overview: "Led by Woody, Andy's toys live happily in his room until Andy's birthday brings Buzz Lightyear onto the scene. Afraid of losing his place in Andy's heart, Woody plots against Buzz. But when circumstances separate Buzz and Woody from their owner, the duo eventually learns to put aside their differences."
popularity: "21.946943"
poster_path: "/rhIRbceoE9lR4veEXuwCC2wARtG.jpg"
production_countries: "[{\"iso_3166_1\": \"US\", \"name\": \"United States of America\"}]"
release_date: "1995-10-30"
revenue: "524844632"
runtime: "81"
status: "Released"
tagline: "NA"
title: "Toy Story"
video: "FALSE"
vote_average: "7.7"
vote_count: "5415"
*/

function type(d){
    const date = parseDate(d.release_date);
    return {
        budget: +d.budget,
        genre: parseNA(d.genre),
        //genres: "[{\"id\": 16, \"name\": \"Animation\"}, {\"id\": 35, \"name\": \"Comedy\"}, {\"id\": 10751, \"name\": \"Family\"}]"
        //map:尋訪 只抓name
        genres:JSON.parse(d.genres).map(d=>d.name),
        homepage: parseNA(d.homepage),
        id: +d.id,
        imdb_id: parseNA(d.imdb_id),
        original_language: parseNA(d.original_language),
        overview: parseNA(d.overview),
        popularity: +d.popularity,
        poster_path: parseNA(d.poster_path),
        production_countries:JSON.parse(d.production_countries), 
        release_date: date,
        release_year: date.getFullYear(),
        revenue: +d.revenue,
        runtime: +d.runtime,
        tagline: parseNA(d.tagline),
        title: parseNA(d.title),
        vote_average: +d.vote_average,
        vote_count: +d.vote_count
    }
}

function filterData(data){
    return data.filter(
        d => {
            return(
                d.release_year > 1999 && d.release_year < 2010 &&
                d.revenue > 0 &&d.budget > 0 && d.genre &&d.title
            );
        }
    );
}
function setupCanvas(barChartData){//drae the graph
    //svg g
    const svg_width = 400;
    const svg_height = 500;
    const chart_margin = {top:80,right:40,bottom:40,left:80};
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);

    const this_svg = d3.select('.bar-chart-container').append('svg')
                        .attr('width',svg_width).attr('height',svg_height)
                        .append('g')//同時寫字串跟變數` `:${}:變數放這裡面
                        .attr('transform',`translate(${chart_margin.left},${chart_margin.top})`);

    //data to page//scale縮放

    //1.最小值到最大值
    //d3.extent find the max & min in revenu
    const xExtent = d3.extent(barChartData, d=>d.revenue);//資料取revenue
    //domain放資料的最小值到最大值
    //range 圖
    const xScale_v1 = d3.scaleLinear().domain(xExtent).range([0,chart_width]);
    
    //2.0到最大值
    const xMax = d3.max(barChartData, d=>d.revenue);
    const xScale_v2 = d3.scaleLinear().domain([0, xMax]).range([0,chart_width]);

    //3.V3.Short writing for v2
    const xScale_v3 = d3.scaleLinear([0,xMax],[0, chart_width])

    const yScale = d3.scaleBand().domain(barChartData.map(d=>d.genre))
                    .rangeRound([0, chart_height])
                    .paddingInner(0.25);

    //Draw bars
    const bars = this_svg.selectAll('.bar')//selectAll 現在才要做bar 有點邊宣告但同時選擇的感覺
                        .data(barChartData)
                        .enter()//enter 實際畫出來
                        .append('rect')//長條圖
                        .attr('class','bar')//這些rectangle的class名稱為bar
                        .attr('x',0)
                        .attr('y',d=>yScale(d.genre))
                        .attr('width',d=>xScale_v3(d.revenue))
                        .attr('height',yScale.bandwidth())
                        .style('fill', 'dodgerblue');//換顏色
    
    const header = this_svg.append('g').attr('class','bar-header')
        .attr('transform',`translate(0,${-chart_margin.top/2})`)
        .append('text');
        
    header.append('tspan').text('Total revenue by genre in $US');
    header.append('tspan').text('Years:2000-2009')
    .attr('x',0).attr('y',20).style('font-size','0.8em').style('fill','#555');

    
    //tickSizeInner : the length of the tick lines
    //tickSizeOuter : the length of the square ends of the domain path
    const xAxis = d3.axisTop(xScale_v3)//軸top的位置
                    .tickFormat(formatTicks)
                    .tickSizeInner(-chart_height)
                    .tickSizeOuter(0);
    const xAxisDraw = this_svg.append('g')
                        .attr('class','x axis')
                        .call(xAxis);
    const yAxis = d3.axisLeft(yScale).tickSize(0);//ticksize = tickSizeInner+Outer 
    const yAxisDraw = this_svg.append('g')
                        .attr('class','y axis')
                        .call(yAxis);
    yAxisDraw.selectAll('text').attr('dx','-0.6em');

}

function formatTicks(d){
    return d3.format('~s')(d)//d3.format return一個function回來再放值進去
    //~s 刪掉零
    .replace('M','mil')//預設是MGT 改預設
    .replace('G','bil')
    .replace('T','tri')
}
    

function ready(movies){
    const moviesClean = filterData(movies);
    const barChartData = prepareBarChartData(moviesClean).sort(
        (a,b)=>{
            return d3.descending(a.revenue, b.revenue);
        }
    );
    console.log(barChartData);
    setupCanvas(barChartData);
}

function prepareBarChartData(data){
    console.log(data);
    const dataMap = d3.rollup(//d3的rollup:
        data,//資料
        v => d3.sum(v, leaf => leaf.revenue), //將revenue加總//leaf:每一筆資料//v:value
        d => d.genre //依電影分類groupby//d:類別
    );
    const dataArray = Array.from(dataMap, d=>({genre:d[0], revenue:d[1]}));
    return dataArray;
}
    

d3.csv('data/movies.csv',type).then(//丟完function type了
    res=>{
        //console.log(res);
        ready(res);
    }
)