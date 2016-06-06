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
    var table = document.getElementById("inTable"); 
    if (table.rows.length == 1) {
        input_table = read_table("inTable")[0]; 
        x1 = input_table[0];
        y1 = input_table[1];
        x2 = input_table[2];
        y2 = input_table[3]; 
        console.log(x1, y1, x2, y2); 
        one_throw_update(x1, y1, x2, y2);
    } else {
        two_throw_update(); 
    }
}

function two_throw_update() {
    var intercept = line_intersection(); 
    var intercept_x = intercept[0];
    var intercept_y = intercept[1]; 

    clear_canvas();
    draw_axes(); 
    draw_throw_lines(); 
    update_results_text(Math.round(intercept_x) + ", " + Math.round(intercept_y));
}

function one_throw_update(x1, y1, x2, y2) {
    var line = get_line(x1, y1, x2, y2); 
    var scale = get_scaling_factor([x1, x2, y1, y2])

    clear_canvas();
    draw_axes(); 

    radius1 = 1408;
    radius2 = 2688;
    
    intersection1 = circle_intersection(x1, y1, x2, y2, radius1);
    intersection2 = circle_intersection(x1, y1, x2, y2, radius2);
    
    int_x1 = Math.round(intersection1['x'])
    int_y1 = Math.round(intersection1['y'])
    int_x2 = Math.round(intersection2['x'])
    int_y2 = Math.round(intersection2['y'])

    draw_line_segment(int_x2, int_y2, int_x1, int_y1, "white"); 

    point1 = "Stronghold between " + int_x1 + ", " + int_y1 + " and "; 
    point2 =  int_x2 + ", " + int_y2; 
    [midpoint_x, midpoint_y] = [(int_x1 + int_x2) / 2, (int_y1, int_y2) / 2]; 
    midpoint_info = "<br/><br/> midpoint: " + midpoint_x + ", " +  midpoint_y; 

    update_results_text(point1 + point2 + midpoint_info); 
}

function update_results_text(results) {
    document.getElementById('result').innerHTML = results;  
}


function draw_line_segment(x1, y1, x2, y2, color) {
    c=document.getElementById("map"); 
    scaling_factor = get_scaling_factor([3000]);

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

function circle_intersection(x1, y1, x2, y2, r) {

    dx = x2 - x1;
    dy = y2 - y1;
    dr = Math.sqrt(dx * dx + dy * dy); 
    D = x1 * y2 - x2 * y1;

    square_root = Math.sqrt( r * r * dr * dr - D * D); 
    intersect_y_vals = [(-D * dx + Math.abs(dy) * square_root ) / (dr * dr), (-D * dx + Math.abs(dy) * square_root ) / (dr * dr)]; 


    going_up = dy > 0; 
    if (going_up) {
        intersect_y = Math.max.apply(Math, intersect_y_vals); 
    } else {
        intersect_y = Math.min.apply(Math, intersect_y_vals); 
    }

    line = get_line(x1, y1, x2, y2); 
    // y = mx + b  -> mx = y - b -> x = (y - b) / m
    intersect_x =  (intersect_y - line['b']) / line['m']; 

    return {'x': intersect_x, 'y': intersect_y};
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

function read_input(input_ids) {
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

    var input_ids = ["t1x","t1y","c1x" ,"c1y" ,"t2x" ,"t2y" ,"c2x" ,"c2y"]; 
    var input = read_input(input_ids); 

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


   
function largest_coord_val(input_object) {
    var values = Object.keys(input_object).map(key => input_object[key]);
    var absolute_values = values.map(Math.abs); 
    return Math.max.apply(Math, absolute_values); 

}

function get_scaling_factor(input_values) {
    c=document.getElementById("map"); 
    var edge_value = largest_coord_val(input_values) + 100; 
    return edge_value / (c.height / 2.1);
}

function get_edge_value(scale) {
    c=document.getElementById("map"); 
    return scale * c.height / 2.1; 
}

function draw_line(line, scaling_factor,color) {
    c=document.getElementById("map"); 
    // The highest point value (x or y) that will be shown

    var edge_value = get_edge_value(scaling_factor);  
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
    var input_ids = ["t1x","t1y","c1x" ,"c1y" ,"t2x" ,"t2y" ,"c2x" ,"c2y"]; 

    var input_points = read_input(input_ids); 
    [intersect_x, intersect_y] = line_intersection(); 

    input_points["intersect_x"] = intersect_x;
    input_points["intersect_y"] = intersect_y;
    
    var scale = get_scaling_factor(input_points); 


    var input = read_input(input_ids); 
    var t1x = input["t1x"]; 
    var t1y = input["t1y"]; 
    var c1x = input["c1x"]; 
    var c1y = input["c1y"]; 
    var line1 = get_line(t1x, t1y, c1x, c1y); 
    draw_line(line1, scale,"white"); 

    var t2x = input["t2x"]; 
    var t2y = input["t2y"];         
    var c2x = input["c2x"];         
    var c2y = input["c2y"]; 
    var line2 = get_line(t2x, t2y, c2x, c2y); 
    draw_line(line2, scale,  "white"); 


}

function add_throw() {
    var table = document.getElementById("inTable"); 
    var tablesize = table.rows.length; 
    var row = table.insertRow(tablesize);

    var cells = []; 
    for (i = 1; i < 6; i++) {cells.push(row.insertCell(0)); }

    cells[4].innerHTML = "<p>Throw " + (tablesize + 1 )  + "</p>";
    for (i = 0; i < 4; i++) { cells[i].innerHTML = "<input type=\"text\">";}
}

function read_table(tableid) {
    var table = document.getElementById(tableid); 
    
    var data_table = []
    var throwx, throwy, catchx, catchy; 

    for (i=0; i < table.rows.length ; i++) {
        // the table is laid out like this: 
        // row label |  throwx | throwy | catchx | catchy
        throwx = parseInt(table.rows[i].cells[1].children[0].value); 
        throwy = parseInt(table.rows[i].cells[2].children[0].value); 
        catchx = parseInt(table.rows[i].cells[3].children[0].value); 
        catchy = parseInt(table.rows[i].cells[4].children[0].value); 
        data_table.push([throwx, throwy, catchx, catchy])
    }
    return data_table; 
}
