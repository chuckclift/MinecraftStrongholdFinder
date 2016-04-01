window.onload=function(){ 
    clear_canvas();
    draw_axes(); 
}

function clear_canvas() {
    c=document.getElementById("map"); 
    cc=c.getContext("2d"); 
    
    cc.fillStyle = 'black';
    cc.fillRect(0,0,c.width,c.height); 
}

function draw_axes() {
    c=document.getElementById("map"); 
    cc=c.getContext("2d"); 
    
    clear_canvas(); 
    // draw x axis
    cc.beginPath();
    cc.moveTo(0, c.height/2);
    cc.lineTo(c.width, c.height/2);
    cc.lineWidth = 5;
    cc.strokeStyle = 'grey';
    cc.stroke();
    
    // draw y axis
    cc.beginPath();
    cc.moveTo(c.width/2, 0);
    cc.lineTo(c.width/2, c.height);
    cc.lineWidth = 5;
    cc.strokeStyle = 'grey';
    cc.stroke();
}

function update() {
    var intercept = line_intersection(); 
    var intercept_x = intercept[0];
    var intercept_y = intercept[1]; 

    document.getElementById('result').innerHTML = Math.round(intercept_x) + 
                                            ", " + Math.round(intercept_y)
    clear_canvas();
    draw_axes(); 
    draw_throw_lines(); 
}

function get_slope(x1, y1, x2, y2) {
    return  (y2 - y1) / (x2 - x1); 
}

function get_y_intercept(x1, y1, slope) {
    return y1 - slope * x1;  
}

function x_intersection(line1, line2) {
    
    return (line2["b"] - line1["b"]) / (line1["m"] - line2["m"]); 
}

function parse_input_box(input_id) {
    return parseInt(document.getElementById(input_id).value); 
}

function read_input() {
    var input_ids = ["t1x","t1y","c1x" ,"c1y" ,"t2x" ,"t2y" ,"c2x" ,"c2y"]; 
    var input_values = {}; 

    for (var i=0; i<input_ids.length; i++) {
        id = input_ids[i]; 
        input_values[id] = parse_input_box(id);  
    }
    return input_values; 
}

function get_line(x1,y1,x2,y2) {
    m = get_slope(x1, y1, x2, y2);  // t1x, t1y, c1x, c1y); 
    b = get_y_intercept(x1, y1, m); 
    return {"m":m, "b":b}; 
}

function line_intersection() {
    var input = read_input(); 

    var t1x = input["t1x"]; 
    var t1y = input["t1y"]; 
    var c1x = input["c1x"]; 
    var c1y = input["c1y"]; 
    
    var t2x = input["t2x"]; 
    var t2y = input["t2y"];         
    var c2x = input["c2x"];         
    var c2y = input["c2y"]; 

    var line1 = get_line(t1x, t1y, c1x, c1y);  
    var line2 = get_line(t2x, t2y, c2x, c2y); 

    intercept_x = x_intersection(line1, line2); 

    intercept_y = line1["m"] * intercept_x + line1["b"]; 
    return [intercept_x, intercept_y]; 
}


   
function largest_coord_val() {

    var input = read_input(); 
    var input_keys = Object.keys(input);
    var values = input_keys.map(function(v){return input[v];});

    // adding the intersection point to the 
    values = values.concat(line_intersection());   

    var absolute_values = values.map(Math.abs); 
    return Math.max.apply(Math, absolute_values); 

}

function draw_line(line,color) {
    c=document.getElementById("map"); 

    // The highest point value (x or y) that will be shown
    var edge_value = largest_coord_val() + 100; 
    var scaling_factor = edge_value / (c.height / 2.1) ;

    var x1 = -edge_value; 
    var x2 = edge_value; 

    var y1 = line["m"] * -edge_value + line["b"];
    var y2 = line["m"] * edge_value + line["b"];

    var point1 = transform_point(x1,y1, scaling_factor);
    var point2 = transform_point(x2,y2, scaling_factor);

    c=document.getElementById("map"); 
    cc=c.getContext("2d"); 
    cc.beginPath();
    cc.moveTo(point1[0], point1[1]);
    cc.lineTo(point2[0], point2[1]);
    cc.lineWidth = 2;
    // set line color
    cc.strokeStyle = color;
    cc.stroke();
}

function transform_point(x,y,scale) {
    /* trasforming values to fit onto map
        steps:
            1.  flip y (by multiplying it by -1
            3.  Apply scaling factor
            2. translate by half the mapsize 
    */
    c=document.getElementById("map"); 
    x = (x / scale) + c.width/2;
    y = (-y / scale) + c.height/2; 
    return [x,y]; 


}
function draw_throw_lines() {
    // draws the lines coming from the throws to 
    // help visualize where they intersect
    var input = read_input(); 

    
    var t1x = input["t1x"]; 
    var t1y = input["t1y"]; 
    var c1x = input["c1x"]; 
    var c1y = input["c1y"]; 
    var line1 = get_line(t1x, t1y, c1x, c1y); 
    draw_line(line1,"white"); 

    var t2x = input["t2x"]; 
    var t2y = input["t2y"];         
    var c2x = input["c2x"];         
    var c2y = input["c2y"]; 
    var line2 = get_line(t2x, t2y, c2x, c2y); 
    draw_line(line2, "white"); 
}


