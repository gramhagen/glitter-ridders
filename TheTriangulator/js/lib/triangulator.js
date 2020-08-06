var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var d3 = require('d3');

// See triangulator.py for the kernel counterpart to this file.


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var TriangulatorModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'TriangulatorModel',
        _view_name : 'TriangulatorView',
        _model_module : 'TheTriangulator',
        _view_module : 'TheTriangulator',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        distance0 : -1,
        distance1 : -1,
        running: true
    })
});


// Custom View. Renders the widget model.
var TriangulatorView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
        this.width = 1024;
        this.height = 1024;

        // magic nubmers to align with the SVG
        this.boardX = 132;
        this.boardY = 228;
        this.boardHeightPx = 696;
        
        // inter sensor calibration slider
        this.interSensorDistanceSlider = document.createElement('input');
        this.interSensorDistanceSlider.type = 'range';
        this.interSensorDistanceSlider.min = 10;
        this.interSensorDistanceSlider.max = 90;
        this.interSensorDistanceSlider.value = 30;
        
        this.boardHeight = this.interSensorDistanceSlider.value;
        this.boardWidth = this.interSensorDistanceSlider.value;
       
        // draw rect
        this.svg = d3.select(this.el).append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // load board
        var boardSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="board" viewBox="0 0 1104.76 1245.21"><defs><style>.cls-1,.cls-10,.cls-11,.cls-13,.cls-14,.cls-15,.cls-16,.cls-17,.cls-18,.cls-19,.cls-2,.cls-20,.cls-21,.cls-22,.cls-7,.cls-9{fill:none;}.cls-2{stroke:#a7a9ac;}.cls-10,.cls-11,.cls-13,.cls-14,.cls-15,.cls-16,.cls-17,.cls-18,.cls-19,.cls-2,.cls-20,.cls-21,.cls-22,.cls-7,.cls-9{stroke-miterlimit:10;}.cls-3,.cls-4{font-size:40px;}.cls-3,.cls-4,.cls-5{fill:#231f20;}.cls-3,.cls-5{font-family:KarmaticArcade, Karmatic Arcade;}.cls-4{font-family:Digital-7Italic, Digital-7 Italic;font-style:italic;}.cls-5{font-size:60px;}.cls-6{clip-path:url(#clip-path);}.cls-7{stroke:#d1d3d4;}.cls-8{opacity:0.5;}.cls-9{stroke:#a4a6a8;stroke-width:1.5px;}.cls-10{stroke:#b0b2b4;stroke-width:1.25px;}.cls-11{stroke:#bcbec0;}.cls-12{clip-path:url(#clip-path-2);}.cls-13{stroke:#231f20;stroke-width:4px;}.cls-14{stroke:#353435;stroke-width:3.75px;}.cls-15{stroke:#454546;stroke-width:3.5px;}.cls-16{stroke:#535355;stroke-width:3.25px;}.cls-17{stroke:#5f6063;stroke-width:3px;}.cls-18{stroke:#6b6d6f;stroke-width:2.75px;}.cls-19{stroke:#77787b;stroke-width:2.5px;}.cls-20{stroke:#828486;stroke-width:2.25px;}.cls-21{stroke:#8d8f92;stroke-width:2px;}.cls-22{stroke:#989a9d;stroke-width:1.75px;}</style><clipPath id="clip-path"><rect class="cls-1" x="1786.21" y="273.55" width="850.73" height="850.39"/></clipPath><clipPath id="clip-path-2"><rect class="cls-1" x="88.35" y="273.55" width="850.73" height="850.39"/></clipPath></defs><g id="Layer_1" data-name="Layer 1"><rect class="cls-2" x="89.49" y="274.34" width="850.39" height="850.39"/><line class="cls-2" x1="917.21" y1="1124.74" x2="110.55" y2="1124.74"/><line class="cls-2" x1="939.88" y1="983.5" x2="90.76" y2="983.5"/><line class="cls-2" x1="939.88" y1="841.76" x2="90.76" y2="841.76"/><line class="cls-2" x1="939.88" y1="700.03" x2="90.76" y2="700.03"/><line class="cls-2" x1="939.88" y1="558.3" x2="90.76" y2="558.3"/><line class="cls-2" x1="939.88" y1="416.57" x2="90.76" y2="416.57"/><line class="cls-2" x1="939.88" y1="1124.74" x2="939.88" y2="274.34"/><line class="cls-2" x1="798.15" y1="1124.74" x2="798.15" y2="274.34"/><line class="cls-2" x1="656.42" y1="1124.74" x2="656.42" y2="274.34"/><line class="cls-2" x1="514.69" y1="1124.74" x2="514.69" y2="274.34"/><line class="cls-2" x1="372.96" y1="1124.74" x2="372.96" y2="274.34"/><line class="cls-2" x1="231.22" y1="1124.74" x2="231.22" y2="274.34"/><text class="cls-3" transform="translate(994.94 353.37)">1</text><text class="cls-3" transform="translate(992.98 497.06)">2</text><text class="cls-3" transform="translate(992.98 640.75)">3</text><text class="cls-3" transform="translate(992.98 784.44)">4</text><text class="cls-3" transform="translate(992.98 928.12)">5</text><text class="cls-3" transform="translate(992.98 1071.81)">6</text><text class="cls-3" transform="translate(149.32 237.47)">a</text><text class="cls-3" transform="translate(290.5 237.47)">b</text><text class="cls-3" transform="translate(431.68 237.47)">c</text><text class="cls-3" transform="translate(572.85 237.47)">d</text><text class="cls-3" transform="translate(714.03 237.47)">e</text><text class="cls-3" transform="translate(859.03 237.47)">f</text><text class="cls-4" transform="translate(214.04 1173.91)">5</text><text class="cls-4" transform="translate(351.95 1173.91)">10</text><text class="cls-4" transform="translate(493.13 1173.91)">15</text><text class="cls-4" transform="translate(628.12 1173.91)">20</text><text class="cls-4" transform="translate(769.3 1173.91)">25</text><text class="cls-4" transform="translate(914.29 1173.91)">30</text><text class="cls-5" transform="translate(174.73 104.91)">The triangulator</text></g><g id="Layer_2" data-name="Layer 2"><g class="cls-6"><path class="cls-7" d="M1786.21,1337.6c143.46,0,282.73-28.14,414-83.65a1066.3,1066.3,0,0,0,565.72-565.71c55.51-131.23,83.65-270.51,83.65-414s-28.14-282.73-83.65-414A1066.28,1066.28,0,0,0,2200.17-705.4c-131.23-55.51-270.5-83.65-414-83.65s-282.73,28.14-414,83.65A1066.37,1066.37,0,0,0,806.53-139.68c-55.5,131.23-83.65,270.5-83.65,414S751,557,806.53,688.24A1066.46,1066.46,0,0,0,1372.25,1254C1503.48,1309.46,1642.76,1337.6,1786.21,1337.6Z"/><path class="cls-7" d="M1786.21,1266.74c133.92,0,263.91-26.26,386.36-78a995.48,995.48,0,0,0,528-528.06c51.79-122.45,78.05-252.43,78.05-386.35s-26.26-263.91-78.05-386.36a995.42,995.42,0,0,0-528-528c-122.45-51.8-252.44-78-386.36-78s-263.9,26.25-386.35,78A995.48,995.48,0,0,0,871.8-112.08c-51.79,122.45-78,252.44-78,386.36s26.26,263.9,78,386.35a995.55,995.55,0,0,0,528.06,528.06C1522.31,1240.48,1652.29,1266.74,1786.21,1266.74Z"/><path class="cls-7" d="M1786.21,1195.87c124.39,0,245.09-24.38,358.75-72.45A924.57,924.57,0,0,0,2635.35,633c48.08-113.66,72.46-234.36,72.46-358.74s-24.38-245.09-72.46-358.75A924.57,924.57,0,0,0,2145-574.87c-113.66-48.07-234.36-72.45-358.75-72.45s-245.08,24.38-358.75,72.45A924.66,924.66,0,0,0,937.07-84.47C889,29.19,864.62,149.89,864.62,274.28S889,519.36,937.07,633a924.66,924.66,0,0,0,490.39,490.4C1541.13,1171.49,1661.83,1195.87,1786.21,1195.87Z"/><g class="cls-8"><circle class="cls-9" cx="1786.21" cy="274.28" r="708.96"/><circle class="cls-10" cx="1786.21" cy="274.28" r="779.85"/><circle class="cls-11" cx="1786.21" cy="274.28" r="850.73"/></g><path class="cls-7" d="M1786.21,2188.33c143.46,0,282.73-28.14,414-83.65A1066.3,1066.3,0,0,0,2765.89,1539c55.51-131.23,83.65-270.51,83.65-414s-28.14-282.73-83.65-414a1066.28,1066.28,0,0,0-565.72-565.72c-131.23-55.51-270.5-83.65-414-83.65s-282.73,28.14-414,83.65A1066.37,1066.37,0,0,0,806.53,711.05c-55.5,131.23-83.65,270.5-83.65,414s28.15,282.73,83.65,414a1066.39,1066.39,0,0,0,565.72,565.71C1503.48,2160.19,1642.76,2188.33,1786.21,2188.33Z"/><path class="cls-7" d="M1786.21,2117.47c133.92,0,263.91-26.26,386.36-78a995.48,995.48,0,0,0,528-528.06c51.79-122.45,78.05-252.44,78.05-386.35s-26.26-263.91-78.05-386.36a995.48,995.48,0,0,0-528-528.06c-122.45-51.79-252.44-78.05-386.36-78.05s-263.9,26.26-386.35,78.05A995.55,995.55,0,0,0,871.8,738.65c-51.79,122.45-78,252.44-78,386.36s26.26,263.9,78,386.35a995.55,995.55,0,0,0,528.06,528.06C1522.31,2091.21,1652.29,2117.47,1786.21,2117.47Z"/><path class="cls-7" d="M1786.21,2046.6c124.39,0,245.09-24.38,358.75-72.45a924.57,924.57,0,0,0,490.39-490.4c48.08-113.66,72.46-234.36,72.46-358.74s-24.38-245.09-72.46-358.75A924.57,924.57,0,0,0,2145,275.86c-113.66-48.07-234.36-72.45-358.75-72.45s-245.08,24.38-358.75,72.45a924.66,924.66,0,0,0-490.39,490.4C889,879.92,864.62,1000.62,864.62,1125s24.37,245.08,72.45,358.74a924.66,924.66,0,0,0,490.39,490.4C1541.13,2022.22,1661.83,2046.6,1786.21,2046.6Z"/><g class="cls-8"><circle class="cls-9" cx="1786.21" cy="1125.01" r="708.96"/><circle class="cls-10" cx="1786.21" cy="1125.01" r="779.85"/><circle class="cls-11" cx="1786.21" cy="1125.01" r="850.73"/></g></g><g class="cls-12"><path class="cls-7" d="M88.35,1337.6c143.46,0,282.73-28.14,414-83.65a1059.34,1059.34,0,0,0,337.93-227.79A1059.63,1059.63,0,0,0,1068,688.24c55.51-131.23,83.65-270.51,83.65-414s-28.14-282.73-83.65-414A1059.67,1059.67,0,0,0,840.24-477.61,1059.34,1059.34,0,0,0,502.31-705.4C371.08-760.91,231.81-789,88.35-789s-282.73,28.14-414,83.65A1059.45,1059.45,0,0,0-663.54-477.61,1059.67,1059.67,0,0,0-891.33-139.68C-946.83-8.45-975,130.82-975,274.28s28.15,282.73,83.65,414a1059.49,1059.49,0,0,0,227.8,337.92A1059.38,1059.38,0,0,0-325.61,1254C-194.38,1309.46-55.1,1337.6,88.35,1337.6Z"/><path class="cls-7" d="M88.35,1266.74c133.92,0,263.91-26.26,386.36-78A989.07,989.07,0,0,0,790.13,976.05a988.88,988.88,0,0,0,212.63-315.42c51.79-122.45,78-252.43,78-386.35s-26.26-263.91-78-386.36A988.88,988.88,0,0,0,790.13-427.5,989,989,0,0,0,474.71-640.13c-122.45-51.8-252.44-78-386.36-78s-263.91,26.25-386.35,78A988.88,988.88,0,0,0-613.42-427.5,988.9,988.9,0,0,0-826.06-112.08c-51.79,122.45-78.05,252.44-78.05,386.36s26.26,263.9,78.05,386.35A988.9,988.9,0,0,0-613.42,976.05,989,989,0,0,0-298,1188.69C-175.56,1240.48-45.57,1266.74,88.35,1266.74Z"/><path class="cls-7" d="M88.35,1195.87c124.39,0,245.09-24.38,358.75-72.45A918.42,918.42,0,0,0,740,925.94,918.34,918.34,0,0,0,937.49,633C985.57,519.36,1010,398.66,1010,274.28S985.57,29.19,937.49-84.47A918.56,918.56,0,0,0,740-377.39,918.59,918.59,0,0,0,447.1-574.87c-113.66-48.07-234.36-72.45-358.75-72.45s-245.08,24.38-358.75,72.45A918.44,918.44,0,0,0-563.31-377.39,918.42,918.42,0,0,0-760.79-84.47c-48.08,113.66-72.45,234.36-72.45,358.75S-808.87,519.36-760.79,633A918.2,918.2,0,0,0-563.31,925.94,918.27,918.27,0,0,0-270.4,1123.42C-156.73,1171.49-36,1195.87,88.35,1195.87Z"/><g class="cls-8"><circle class="cls-13" cx="88.35" cy="274.28" r="0.14"/><circle class="cls-14" cx="88.35" cy="274.28" r="71.02"/><circle class="cls-15" cx="88.35" cy="274.28" r="141.91"/><circle class="cls-16" cx="88.35" cy="274.28" r="212.79"/><circle class="cls-17" cx="88.35" cy="274.28" r="283.67"/><circle class="cls-18" cx="88.35" cy="274.28" r="354.55"/><circle class="cls-19" cx="88.35" cy="274.28" r="425.44"/><circle class="cls-20" cx="88.35" cy="274.28" r="496.32"/><circle class="cls-21" cx="88.35" cy="274.28" r="567.2"/><circle class="cls-22" cx="88.35" cy="274.28" r="638.08"/><circle class="cls-9" cx="88.35" cy="274.28" r="708.96"/><circle class="cls-10" cx="88.35" cy="274.28" r="779.85"/><circle class="cls-11" cx="88.35" cy="274.28" r="850.73"/></g><path class="cls-7" d="M88.35,2188.33c143.46,0,282.73-28.14,414-83.65a1059.34,1059.34,0,0,0,337.93-227.79A1059.63,1059.63,0,0,0,1068,1539c55.51-131.23,83.65-270.51,83.65-414s-28.14-282.73-83.65-414A1059.67,1059.67,0,0,0,840.24,373.12,1059.34,1059.34,0,0,0,502.31,145.33c-131.23-55.51-270.5-83.65-414-83.65s-282.73,28.14-414,83.65A1059.45,1059.45,0,0,0-663.54,373.12,1059.67,1059.67,0,0,0-891.33,711.05C-946.83,842.28-975,981.55-975,1125s28.15,282.73,83.65,414a1059.49,1059.49,0,0,0,227.8,337.92,1059.19,1059.19,0,0,0,337.92,227.79C-194.38,2160.19-55.1,2188.33,88.35,2188.33Z"/><path class="cls-7" d="M88.35,2117.47c133.92,0,263.91-26.26,386.36-78a989.07,989.07,0,0,0,315.42-212.64,988.88,988.88,0,0,0,212.63-315.42c51.79-122.45,78-252.44,78-386.35s-26.26-263.91-78-386.36A988.88,988.88,0,0,0,790.13,423.23,989.18,989.18,0,0,0,474.71,210.59C352.26,158.8,222.27,132.54,88.35,132.54S-175.56,158.8-298,210.59A989.07,989.07,0,0,0-613.42,423.23,988.9,988.9,0,0,0-826.06,738.65C-877.85,861.1-904.11,991.09-904.11,1125s26.26,263.9,78.05,386.35a988.9,988.9,0,0,0,212.64,315.42A989,989,0,0,0-298,2039.42C-175.56,2091.21-45.57,2117.47,88.35,2117.47Z"/><path class="cls-7" d="M88.35,2046.6c124.39,0,245.09-24.38,358.75-72.45A918.42,918.42,0,0,0,740,1776.67a918.34,918.34,0,0,0,197.47-292.92C985.57,1370.09,1010,1249.39,1010,1125s-24.38-245.09-72.46-358.75A918.45,918.45,0,0,0,740,473.34,918.42,918.42,0,0,0,447.1,275.86c-113.66-48.07-234.36-72.45-358.75-72.45s-245.08,24.38-358.75,72.45A918.27,918.27,0,0,0-563.31,473.34,918.31,918.31,0,0,0-760.79,766.26c-48.08,113.66-72.45,234.36-72.45,358.75s24.37,245.08,72.45,358.74a918.2,918.2,0,0,0,197.48,292.92A918.27,918.27,0,0,0-270.4,1974.15C-156.73,2022.22-36,2046.6,88.35,2046.6Z"/><g class="cls-8"><circle class="cls-13" cx="88.35" cy="1125.01" r="0.14"/><circle class="cls-14" cx="88.35" cy="1125.01" r="71.02"/><circle class="cls-15" cx="88.35" cy="1125.01" r="141.91"/><circle class="cls-16" cx="88.35" cy="1125.01" r="212.79"/><circle class="cls-17" cx="88.35" cy="1125.01" r="283.67"/><circle class="cls-18" cx="88.35" cy="1125.01" r="354.55"/><circle class="cls-19" cx="88.35" cy="1125.01" r="425.44"/><circle class="cls-20" cx="88.35" cy="1125.01" r="496.32"/><circle class="cls-21" cx="88.35" cy="1125.01" r="567.2"/><circle class="cls-22" cx="88.35" cy="1125.01" r="638.08"/><circle class="cls-9" cx="88.35" cy="1125.01" r="708.96"/><circle class="cls-10" cx="88.35" cy="1125.01" r="779.85"/><circle class="cls-11" cx="88.35" cy="1125.01" r="850.73"/></g></g></g></svg>';
        
        var parser = new DOMParser();
        var boardDoc = parser.parseFromString(boardSVG, "image/svg+xml");
        this.svg.node().appendChild(boardDoc.documentElement);
            
        this._distance_changed();
        
        this.listenTo(this.model, 'change:distance0', this._distance_changed, this);            
        this.listenTo(this.model, 'change:distance1', this._distance_changed, this);            

        // draw button
        this.btn = document.createElement('button');
        this.btn.innerHTML = "stop";
        this.btn.style = "display:block";
        
        // JavaScript -> Python
        this.btn.onclick = this._button_clicked.bind(this);
        
        this.el.append(this.btn);
        
        // add slider
        this.el.append(this.interSensorDistanceSlider);
    },

    _button_clicked: function() {
        // stop the polling
        this.model.set('running', false);
        this.model.save_changes();
        
        this.btn.innerHTML = "done";
        this.btn.disabled = true;
    },
    
    scaleX: function(x) {
        return this.boardX + (x / this.boardWidth) * this.boardHeightPx;
    },
    
    scaleY: function(y) {
        return this.boardY + (y / this.boardHeight) * this.boardHeightPx;
    },
    
    scaleDistance: function(d) { 
        return (d / this.boardWidth) * this.boardHeightPx;
    },
    
    _distance_changed: function() {
        
        // render arcs
        var oldDistance0 = this.model.previous('distance0');
        var distance0 = this.model.get('distance0');
        var distance1 = this.model.get('distance1');
        
        var dataset = [
            {
                "distanceInPx": this.scaleDistance(distance0),
                "x": this.boardX,
                "y": this.boardY,
                "startAngle": 90,
                "endAngle": 180
            },
            {
                "distanceInPx": this.scaleDistance(distance1),
                "x": this.boardX,
                "y": this.scaleY(this.interSensorDistanceSlider.value),
                "startAngle": 0,
                "endAngle": 90
            }
        ];
        
        var drawArc = d3.arc()
            .innerRadius(function(d) { return d.distanceInPx; })
            .outerRadius(function(d) { return d.distanceInPx + 1; })
            .startAngle(function(d) { return d.startAngle * (Math.PI/180); })
            .endAngle(function(d) { return d.endAngle * (Math.PI/180); });
        
        var paths = this.svg.selectAll("path.arcs")
            .data(dataset);
        
        // need for the update
        paths = paths.enter().append("path")
            .attr("class", "arcs")
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .merge(paths);
        
        if (oldDistance0 >= 0) {
            paths = paths.transition().duration(250);
        }
       
        paths
            .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")";
            })
            .attr("d", drawArc);
        
        // Heron's formula: https://en.wikipedia.org/wiki/Heron%27s_formula
        // s = (a+b+c) / 2
        var interSensorDistance = this.interSensorDistanceSlider.value * 1.0;
        var s = (distance0 + distance1 + interSensorDistance) / 2 
        // h = ...
        var x = Math.sqrt(4 * s * (s - distance0) * (s - distance1) * (s - interSensorDistance) / 
                          (interSensorDistance * interSensorDistance)); 
        // d = (-a^2 + b^2 + c^2) / 2*c
        var y = (- (distance0 * distance0) + (distance1 * distance1) + (interSensorDistance * interSensorDistance)) / 
                (2 * interSensorDistance);
        
        y = this.boardHeight - y;
        
        if (Number.isNaN(x) || Number.isNaN(y))
            return;
        
        var lineData = [
            {"stroke": "blue", // position detected 
             "data": [ 
               { "x": 0, "y": this.boardHeight },
               { "x": 0, "y": y },
               { "x": x, "y": y} 
             ] },
            {"stroke": "red", // sensor 0
             "data": [
               { "x": 0, "y": 0 },
               { "x": x, "y": y } 
             ] },
            {"stroke": "red", // sensor 1
             "data": [ 
             { "x": 0, "y": this.boardHeight },
             { "x": x, "y": y }
            ] }
        ];
        
        var that = this;
        
        var lineFunction = d3.line()
            .x(function(d) { return that.scaleX(d.x); })
            .y(function(d) { return that.scaleY(d.y); });
                    
        var lineXY = this.svg.selectAll("path.linesXY")
            .data(lineData);
        
        lineXY.enter().append("path").attr("class", "linesXY")
            .merge(lineXY)
            .attr("stroke", function(d) { return d.stroke; })
            .attr("stroke-width", 2)
            .style("stroke-dasharray", ("5, 5"))
            .attr("fill", "none")
            .attr("d", function(d) { return lineFunction(d.data); });
        
        var textDataset = [
            {
                "value": distance0,
                "x": (x / 2) + 1.5,
                "y": y / 2,
                "prefix": "a = ",
                "fill": "red"
            },
            {
                "value": distance1,
                "x": x / 2 + 1.5,
                "y": this.boardHeight - (this.boardHeight - y) / 2 - 1,
                "prefix": "b = ",
                "fill": "red"
            },
            {
                "value": x,
                "x": (x / 2) - 3,
                "y": y - 0.2,
                "prefix": "h = ",
                "fill": "blue"
            },
            {
                "value": this.boardHeight - y,
                "x": 0.2,
                "y": this.boardHeight - (this.boardHeight - y) / 2 + 1,
                "prefix": "d = ",
                "fill": "blue"
            }
        ];
        
        var texts = this.svg.selectAll("text.annotations")
            .data(textDataset);
        
        texts = texts.enter().append("text").attr("class", "annotations")
            .merge(texts)
            .attr("x", function(d) { return that.scaleX(d.x); })
            .attr("y", function(d) { return that.scaleY(d.y); })
            .attr("fill", function(d) { return d.fill; })
            // 1 Digit
            .text(function(d) { return d.prefix + (Math.round(d.value * 10) / 10) + " cm"; });
        
        this.firstTime = false;   
    }
});

module.exports = {
    TriangulatorModel: TriangulatorModel,
    TriangulatorView: TriangulatorView
};