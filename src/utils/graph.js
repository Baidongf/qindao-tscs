import * as d3 from 'd3';
import {
  select,
  symbol,
  forceLink,
  forceSimulation,
  forceManyBody,
  forceCenter,
  zoomIdentity,
  drag,
  event,
  zoom,
  tree,
  hierarchy,
  linkRadial,
  pack
} from 'd3';

function measureText(text, fontSize) {
  if (!text || text.length === 0)
    return {height: 0, width: 0};
  var container = select('body').append('svg').attr('class', 'dummy');
  container.append('text')
    .attr('x', -1000)
    .attr('y', -1000)
    .attr('font-size', fontSize)
    .text(text);
  var bbox = container.node().getBBox();
  var height = bbox.height;
  var width = bbox.width;
  container.remove();
  return {height: height, width: width};
}

function traversalTree(data, func) {
  if (!data || !data.properties)
    return;
  func = func || function () {
  };
  data.children_num = data.children && data.children.length || 0;
  data._key = data.properties && data.properties._key || '';
  func(data);
  data.children && data.children.forEach(function (item) {
    item.prev = data.properties;
    traversalTree(item, func);
  });
  return data;
}

function isSafari() {
  var ua = navigator.userAgent.toLowerCase();
  return (ua.includes('safari') && !ua.includes('chrome')) || (ua.includes('micromessenger') && ua.includes('iphone') // 微信
  );
}

var Utils = {
  measureText: measureText,
  traversalTree: traversalTree,
  isSafari: isSafari
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf ||
    ({__proto__: []} instanceof Array && function (d, b) {
      d.__proto__ = b;
    }) ||
    function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var BaseGraph = /** @class */ (function () {
  function BaseGraph() {
    // empty
  }

  BaseGraph.prototype.draw = function (param) {
    return this;
  };
  BaseGraph.prototype.bindEvents = function () {
    return this;
  };
  BaseGraph.prototype.init = function () {
    this.draw()
      .bindEvents();
  };
  return BaseGraph;
}());

var Force = /** @class */ (function (_super) {
  __extends(Force, _super);

  function Force(options) {
    var _this = _super.call(this) || this;
    _this.defaultOptions = {
      r: 20,
      distance: 250,
      shape: 'circle',
      width: window.innerWidth,
      height: window.innerHeight,
      chargeStrength: -2500,
      alphaDecay: 0.07,
      vertexColor: '#e3e3e3',
      edgeColor: '#e3e3e3',
      vertexFontSize: 12,
      edgeFontSize: 12,
      scalable: true,
      scaleExtent: [0.5, 2],
      scaleBar: false,
      draggable: true,
      curNodeId: '',
      isRotate90: false,
      transform: {k: 1}
    };
    _this.options = Object.assign({}, _this.defaultOptions, options);
    _this.adjList = [];
    _this.vertexesMap = [];
    _this.edgeTo = [];
    _this.marker = [];
    _this.symbol = symbol();
    _this.vertexes = JSON.parse(JSON.stringify(_this.options.data.vertices));
    _this.edges = JSON.parse(JSON.stringify(_this.options.data.edges));
    _this.theme = 'light';
    _this.curNodeId = _this.options.curNodeId;
    _this.isSafari = Utils.isSafari();
    _this.initNodePos = {x: 0, y: 0};
    if (_this.options.isRotate90) {
      var tmp = _this.options.width;
      _this.options.width = _this.options.height;
      _this.options.height = tmp;
    }
    return _this;
  }

  /** 入口 */
  Force.prototype.init = function () {
    this.preprocess()
      .draw()
      .bindEvents();
  };
  Force.prototype.preprocess = function () {
    this.preprocessChart()
      .preprocessData();
    return this;
  };
  Force.prototype.preprocessChart = function () {
    var el = this.options.el;
    select(el).selectAll('*').remove();
    this.svg = select(el).append('svg');
    this.svg.attr('width', this.options.width)
      .attr('height', this.options.height)
     /* .style('position', 'absolute');*/
    this.chartGroup = this.svg.append('g')
      .classed('force', true);
    this.chartGroup.append('g')
      .classed('edges', true);
    this.chartGroup.append('g')
      .classed('vertexes', true);
    this.chartGroup.append('defs');
    return this;
  };
  Force.prototype.preprocessData = function () {
    var _this = this;
    this.vertexes.forEach(function (v) {
     // v._type = v._type || v._id.split('/')[0];
      if(v._schema){
        var schema = v._schema.split('.')
        v._type=schema[1]||schema[0]
      }else{
        v._type = v._type || v._id.split('/')[0];
      }
      v.state = v.state || 'normal';
      _this.vertexesMap.push(v._id);
    });
    this.edges.forEach(function (e) {
      var from = _this.vertexesMap.indexOf(e._from);
      var to = _this.vertexesMap.indexOf(e._to);
      e.source = e._from;
      e.target = e._to;
      e._type = e._type || e._id.split('/')[0];
      e.state = e.state || 'normal';
      _this.adjList[from] = _this.adjList[from] || {};
      _this.adjList[from][to] = _this.adjList[from][to] || [];
      _this.adjList[from][to].push(e._id);
    });
    this.setEdgeIndex();
    return this;
  };
  Force.prototype.setEdgeIndex = function () {
    var edgeNumMap = {};
    var vertexNumMap = {};
    var edgeDirection = {};
    this.edges.forEach(function (e) {
      if (!edgeNumMap[e._from + e._to]) {
        edgeNumMap[e._from + e._to] = edgeNumMap[e._to + e._from] = 1;
        edgeDirection[e._from + e._to] = edgeDirection[e._to + e._from] = e._from;
      } else {
        edgeNumMap[e._from + e._to]++;
        edgeNumMap[e._to + e._from]++;
      }
      vertexNumMap[e._from] = vertexNumMap[e._from] ? vertexNumMap[e._from] + 1 : 1;
      vertexNumMap[e._to] = vertexNumMap[e._to] ? vertexNumMap[e._to] + 1 : 1;
      e.edgeIndex = edgeNumMap[e._from + e._to]; // 节点 A、B 之间可能有多条边，这条边所在的 index
    });
    this.edges.forEach(function (e) {
      e.siblingNum = edgeNumMap[e._from + e._to]; // 节点 A、B 之间边的条数
      e.labelDirection = edgeDirection[e._from + e._to] === e._from ? 1 : 0; // 用于控制 label 从左到右还是从右到左渲染
    });
  };
  Force.prototype.draw = function () {
    this.layout()
      .addVertexes()
      .addEdges();
    return this;
  };
  Force.prototype.layout = function () {
    var options = this.options;
    var linkForce = forceLink(this.edges)
      .distance(options.distance)
      .id(function (e) {
        return e._id;
      });
    this.simulation = forceSimulation()
      .alphaDecay(options.alphaDecay)
      .nodes(this.vertexes)
      .force('links', linkForce)
      .force('charge_force', forceManyBody().strength(options.chargeStrength))
      .force('center_force', forceCenter(options.width / 2, options.height / 2))
      .on('tick', this.onTick.bind(this))
      .on('end', this.onEndRender.bind(this));
    return this;
  };
  Force.prototype.onTick = function () {
    var _this = this;
    // 移动点的位置
    this.chartGroup.selectAll('g.vertex')
      .attr('transform', function (d) {
        return "translate(" + d.x + ", " + d.y + ")";
      });
    // IE bug, marker-end 不能动态更新, 所以每次更新位置时都去除 path 再增加上 (note: 会有性能问题)
    if (/Trident/.test(navigator.userAgent)) {
      this.linkEnter.selectAll('.edge-path').remove();
      this.linkEnter.append('path').classed('edge-path', true)
        .attr('fill', 'none')
        .attr('stroke', function (d) {
          return _this.getEdgeColor(d);
        })
        .attr('id', function (d) {
          return d._id.replace('/', '_');
        })
        .attr('marker-end', function (d) {
          return _this.getArrowUrl(d);
        });
    }
    // 移动边的位置
    this.chartGroup.selectAll('.edge-path')
      .attr('d', function (d) {
        var dx = d.target.x - d.source.x;
        var dy = d.target.y - d.source.y;
        var dr = d.siblingNum > 1 ? Math.sqrt((dx * dx) + (dy * dy)) : 0;
        var middleIdx = (d.siblingNum + 1) / 2;
        if (d.siblingNum > 1) {
          dr = d.edgeIndex === middleIdx ? 0 : dr / (Math.log((Math.abs(d.edgeIndex - middleIdx) * 0.6) + 1) +
            (1 / (10 * Math.pow(d.edgeIndex, 2)))); // 弧度绘制
        }
        var sweepFlag = d.edgeIndex > middleIdx ? 1 : 0;
        if (d.labelDirection) {
          sweepFlag = 1 - sweepFlag;
        }
        var path = 'M' + d.source.x + ',' + d.source.y +
          'A' + dr + ',' + dr + ' 0 0 ' + sweepFlag + ',' + d.target.x + ',' + d.target.y;
        _this.chartGroup.select('#' + d._id.replace('/', '_') + '_reverse')
          .attr('d', 'M' + d.target.x + ',' + d.target.y +
            'A' + dr + ',' + dr + ' 0 0 ' + (1 - sweepFlag) + ',' + d.source.x + ',' + d.source.y);
        return path;
      });
    // 边 label 的动态调整
    this.chartGroup.selectAll('.edge-label textPath')
      .attr('xlink:href', function (d) {
        // 通过旋转 label, 使文字始终处于 edge 上方
        if (d.source.x > d.target.x) {
          return '#' + d._id.replace('/', '_') + '_reverse';
        } else {
          return '#' + d._id.replace('/', '_');
        }
      });
    this.chartGroup.selectAll('.edge-label')
      .attr('transform', function (d) {
        var r = Math.sqrt(Math.pow(d.source.x - d.target.x, 2) + Math.pow(d.source.y - d.target.y, 2));
        if (Math.abs(d.source.y - d.target.y) < r / 2) {
          return 'translate(0, -5)';
        } else if ((d.source.x > d.target.x && d.source.y > d.target.y) ||
          (d.source.x < d.target.x && d.source.y < d.target.y)) {
          return 'translate(5, 0)';
        } else if ((d.source.x > d.target.x && d.source.y < d.target.y) ||
          (d.source.x < d.target.x && d.source.y > d.target.y)) {
          return 'translate(-5, 0)';
        }
      });
  };
  Force.prototype.onEndRender = function () {
  };
  Force.prototype.addVertexes = function () {
    this.chartGroup.select('.vertexes').selectAll('*').remove();
    // 增加节点 group
    this.nodeEnter = this.chartGroup.select('.vertexes').selectAll('g')
      .data(this.vertexes)
      .enter()
      .append('g')
      .classed('vertex', true)
      .attr('type', function (d) {
        return d._type;
      });
    this.addVertex() // 增加节点 circle
      .addVertexName() // 增加节点名称
      .addIcon(); // 增加节点 icon
    return this;
  };
  Force.prototype.addVertex = function () {
    var _this = this;
    this.nodeEnter.append('path')
      .attr('d', function (d) {
        var type = _this.getShape(d);
        type = 'symbol' + type[0].toUpperCase() + type.slice(1);
        var size = _this.getRadius(d) * _this.getRadius(d) * Math.PI;
        var _d3 = d3; // 直接使用 d3[type] 报错
        return _this.symbol.size(size).type(_d3[type])();
      })
      .classed('vertex-path', true)
      .attr('fill', function (d) {
        return _this.getVertexColor(d);
      })
      .attr('stroke', function (d) {
        return _this.getVertexStrokeColor(d);
      })
      .attr('stroke-width', function (d) {
        return _this.getVertexStrokeWidth(d);
      });
    this.addCurNodePath();
    return this;
  };
  Force.prototype.addCurNodePath = function () {
    var _this = this;
    this.nodeEnter.each(function (d, i, g) {
      if (d._id === _this.curNodeId) {
        select(g[i])
          .append('path')
          .attr('d', function (d) {
            var type = _this.getShape(d);
            type = 'symbol' + type[0].toUpperCase() + type.slice(1);
            var radius = _this.getRadius(d) + 7;
            var size = radius * radius * Math.PI;
            var _d3 = d3; // 直接使用 d3[type] 报错
            return _this.symbol.size(size).type(_d3[type])();
          })
          .classed('current-vertex-path', true)
          .attr('fill', function (d) {
            return _this.getVertexColor(d);
          })
          .style('opacity', '0.5');
      }
    });
  };
  Force.prototype.addVertexName = function () {
    this.nodeEnter.append('text')
      .attr('class', 'vertex-name')
      .style('text-anchor', 'middle')
      .attr('fill', this.getVertexNameColor.bind(this))
      .each(this.setVertexNamePos.bind(this));
    return this;
  };
  Force.prototype.setVertexNamePos = function (d, i, g) {
    var _this = this;
    if (!d.name)
      return;
    var thisText = select(g[i]);
    thisText.selectAll('*').remove();
    var textStack = this.getTextStack(d) || [];
    textStack.forEach(function (v) {
      thisText.append('tspan').text(v.name)
        .attr('x', v.dx)
        .attr('y', v.dy)
        .style('font-size', _this.options.vertexFontSize + "px");
    });
  };
  Force.prototype.getTextStack = function (d) {
    return this.textUnderVertex(d, 8);
  };
  Force.prototype.textUnderVertex = function (d, lineNum) {
    var textStack = [];
    var name = d.name;
    var y = this.getRadius(d) + this.options.vertexFontSize + 5;
    var lineHeight = this.options.vertexFontSize + 2;
    var j = 0;
    while (name.slice(0, lineNum).length === lineNum) {
      textStack.push({
        name: name.slice(0, lineNum),
        dx: 0,
        dy: (j++ * lineHeight) + y
      });
      name = name.slice(lineNum);
    }
    textStack.push({
      name: name.slice(0),
      dx: 0,
      dy: (j++ * lineHeight) + y
    });
    return textStack;
  };
  Force.prototype.textInVertex = function (d) {
    var radius = this.getRadius(d);
    var name = d.name;
    var fontSize = this.options.vertexFontSize;
    var lineHeight = fontSize + 2;
    var lineNum = Math.floor(Math.sqrt(2) * radius / fontSize); // 每一行的字数
    var maxLine = Math.floor(Math.sqrt(2) * radius / lineHeight); // 最大多少行
    var rowNum = Math.ceil(name.length / lineNum); // 有多少行
    rowNum = rowNum > maxLine ? maxLine : rowNum;
    if (lineNum < 2)
      throw new Error('你的顶点太小了，不适合放置那么大的文字');
    var dY = -lineHeight * (rowNum - 2) / 2;
    var textStack = [];
    while (name.slice(0, lineNum).length === lineNum) {
      // 到最后一行之前，如果还有还多于一行字数，那么就使用省略号取代 3 个位
      if (textStack.length === maxLine - 1 && name.slice(lineNum).length > 0) {
        name = name.slice(0, lineNum - 1) + '...';
        break;
      }
      textStack.push({
        name: name.slice(0, lineNum),
        dx: 0,
        dy: dY
      });
      dY += lineHeight;
      name = name.slice(lineNum);
    }
    textStack.push({
      name: name,
      dx: 0,
      dy: dY
    });
    return textStack;
  };
  Force.prototype.addIcon = function () {
    var _this = this;
    this.nodeEnter.append('image').each(function (d, i, g) {
      var r = _this.getRadius(d);
      select(g[i]).attr('xlink:href', _this.getIcon(d))
        .attr('x', -r)
        .attr('y', -r)
        .attr('width', r * 2)
        .attr('height', r * 2);
    });
  };
  Force.prototype.getIcon = function (d) {
    return this.options.iconPath ? this.options.iconPath + "/" + d._type.toLowerCase() + ".svg " : null;
  };
  Force.prototype.getRadius = function (d) {
    return d.radius || this.options.r;
  };
  Force.prototype.getShape = function (d) {
    return d.shape || this.options.shape;
  };
  Force.prototype.getVertexColor = function (d) {
    switch (d._type) {

      case 'Company':
        switch (this.theme + '-' + d.state) {
          case 'light-normal':
          case 'light-highlight':
          case 'dark-normal':
          case 'dark-highlight':
            return '#4FA2F1';
          case 'light-grey':
            return '#E9E9E9';
          case 'dark-grey':
            return '#323A4D';
          default:
            return this.options.vertexColor;
        }
      case 'Person':
        switch (this.theme + '-' + d.state) {
          case 'light-normal':
          case 'light-highlight':
          case 'dark-highlight':
          case 'dark-normal':
            return '#64C680';
          case 'light-grey':
            return '#E9E9E9';
          case 'dark-grey':
            return '#323A4D';
          default:
            return this.options.vertexColor;
        }
      default:
        return this.options.vertexColor;
    }
  };
  Force.prototype.getVertexStrokeColor = function (d) {
    return 'none';
  };
  Force.prototype.getVertexStrokeWidth = function (d) {
    return 1;
  };
  Force.prototype.getVertexNameColor = function (d) {
    switch (this.theme + '-' + d.state) {
      case 'light-normal':
      case 'light-highlight':
        return '#42444C';
      case 'light-grey':
        return '#B3B3B3';
      case 'dark-normal':
      case 'dark-highlight':
        return '#fff';
      case 'dark-grey':
        return '#646E87';
      default:
        return '#000';
    }
  };
  Force.prototype.addEdges = function () {
    this.chartGroup.select('.edges').selectAll('*').remove();
    this.linkEnter = this.chartGroup.select('.edges').selectAll('g')
      .data(this.edges)
      .enter()
      .append('g')
      .classed('edge', true)
      .attr('type', function (d) {
        return d._type;
      });
    this.addPath() // 增加边路径
      .addEdgeLabel() // 增加边 label
      .addArrow();
    return this;
  };
  Force.prototype.addPath = function () {
    var _this = this;
    this.linkEnter.append('path')
      .classed('edge-path', true)
      .attr('fill', 'none')
      .attr('stroke', function (d) {
        return _this.getEdgeColor(d);
      })
      .attr('id', function (d) {
        return d._id.replace('/', '_');
      });
    // 增加反向路径, 用于旋转 label
    this.chartGroup.select('defs').selectAll('.reverse-path')
      .data(this.edges)
      .enter()
      .append('path')
      .attr('id', function (d) {
        return d._id.replace('/', '_') + '_reverse';
      });
    return this;
  };
  Force.prototype.addEdgeLabel = function () {
    this.linkEnter.append('text')
      .classed('edge-label', true)
      .append('textPath')
      .attr('xlink:href', function (d) {
        return '#' + d._id;
      })
      .attr('startOffset', '50%')
      .attr('text-anchor', 'middle')
      .text(function (d) {
        return d.label ||d._remark||d._label|| '';
      })
      .style('font-size', this.options.edgeFontSize + "px")
      .attr('fill', this.getEdgeLableColor.bind(this));
    return this;
  };
  Force.prototype.addArrow = function () {
    var _this = this;
    this.chartGroup.select('defs')
      .selectAll('.arrow-marker')
      .data(this.edges)
      .enter()
      .append('marker')
      .attr('id', function (d) {
        return 'arrow_' + d._id.replace('/', '_');
      })
      .classed('arrow-marker', true)
      .append('path');
    this.setArrowStyle();
    this.linkEnter.selectAll('.edge-path').attr('marker-end', function (d) {
      return _this.getArrowUrl(d);
    });
    return this;
  };
  // 设置箭头样式
  Force.prototype.setArrowStyle = function () {
    var _this = this;
    this.chartGroup.selectAll('.arrow-marker')
      .each(function (d, i, g) {
        var thisArrow = select(g[i]);
        var _a = _this.getArrowConfig(d), _b = _a.path, path = _b === void 0 ? 'M0,0 L10,5 L0,10 z' : _b,
          _c = _a.arrowWidth, arrowWidth = _c === void 0 ? 10 : _c, _d = _a.arrowHeight,
          arrowHeight = _d === void 0 ? 10 : _d, _e = _a.refx, refx = _e === void 0 ? 0 : _e, _f = _a.color,
          color = _f === void 0 ? '#e3e3e3' : _f;
        thisArrow.attr('refX', _this.getRadius(d.target) + arrowWidth + refx)
          .attr('refY', arrowHeight / 2)
          .attr('markerUnits', 'userSpaceOnUse')
          .attr('markerWidth', arrowWidth)
          .attr('markerHeight', arrowHeight)
          .attr('orient', 'auto')
          .select('path')
          .attr('d', path)
          .attr("fill", color);
      });
  };
  Force.prototype.getArrowConfig = function (d) {
    switch (d.state) {
      case 'normal':
      case 'grey':
        return {
          path: 'M0,0 L10,5 L0,10 z',
          arrowWidth: 10,
          arrowHeight: 10,
          refx: 0,
          color: this.getEdgeColor(d)
        };
      case 'highlight':
        return {
          path: 'M0,0 L14,7 L0,14 z',
          arrowWidth: 14,
          arrowHeight: 14,
          refx: -3,
          color: this.getEdgeColor(d)
        };
      default:
        return {
          path: 'M0,0 L10,5 L0,10 z',
          arrowWidth: 10,
          arrowHeight: 10,
          refx: 0,
          color: this.getEdgeColor(d)
        };
    }
  };
  Force.prototype.getArrowUrl = function (d) {
    return "url(\"#arrow_" + d._id.replace('/', '_') + "\")";
  };
  Force.prototype.getEdgeColor = function (d) {
    switch (this.theme + '-' + d.state) {
      case 'light-normal':
      case 'light-grey':
        return '#D9D9D9';
      case 'light-highlight':
      case 'dark-highlight':
        return this.getVertexColor(d.target);
      case 'dark-grey':
      case 'dark-normal':
        return '#3C4257';
      default:
        return '#000';
    }
  };
  Force.prototype.getEdgeLableColor = function (d) {
    switch (this.theme + '-' + d.state) {
      case 'light-normal':
        return '#5B5B5B';
      case 'light-grey':
        return '#B3B3B3';
      case 'light-highlight':
      case 'dark-highlight':
        return this.getVertexColor(d.target);
      case 'dark-normal':
      case 'dark-grey':
        return '#808593';
      default:
        return '#000';
    }
  };
  Force.prototype.getEdgeWidth = function (d) {
    switch (d.state) {
      case 'normal':
      case 'grey':
        return 1;
      case 'highlight':
        return 4;
      default:
        return 1;
    }
  };
  Force.prototype.initPosition = function (config) {
    var xShift = (this.chartGroup.node().getBBox().width / 2 * config.k);
    var yShift = (this.chartGroup.node().getBBox().height / 2 * config.k);
    if (this.isSafari && this.options.isRotate90) {
      var tmp = xShift;
      xShift = -yShift;
      yShift = tmp;
    }
    config = Object.assign({}, {
      x: xShift,
      y: yShift,
      k: 1
    }, config);
    var t = zoomIdentity.translate(config.x, config.y).scale(config.k);
    this.svg.call(this.zoom.transform, t);
  };
  Force.prototype.bindEvents = function () {
    var _a = this.options, scalable = _a.scalable, scaleExtent = _a.scaleExtent, draggable = _a.draggable;
    scalable && this.bindZoomEvents(scaleExtent);
    draggable && this.bindDragEvents();
    this.bindClickEvents()
      .bindHoverEvents()
      .bindContextmenuEvents();
    return this;
  };
  Force.prototype.bindDragEvents = function () {
    var dragHandler = drag()
      .on('start', this.onDragStart.bind(this))
      .on('drag', this.onDrag.bind(this))
      .on('end', this.onDragEnd.bind(this));
    this.nodeEnter.call(dragHandler);
    return this;
  };
  Force.prototype.onDragStart = function (d, i, g) {
    if (!event.active)
      this.simulation.alphaTarget(0.3).restart();
    this.initNodePos = {
      x: d.x,
      y: d.y
    };
    d.fx = d.x;
    d.fy = d.y;
  };
  Force.prototype.onDrag = function (d, i, g) {
    if (this.isSafari && this.options.isRotate90) {
      d.fx = this.initNodePos.x + (event.y - this.initNodePos.y);
      d.fy = this.initNodePos.y - (event.x - this.initNodePos.x);
    } else {
      d.fx = event.x;
      d.fy = event.y;
    }
  };
  Force.prototype.onDragEnd = function (d, i, g) {
    if (!event.active)
      this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };
  Force.prototype.bindZoomEvents = function (scale) {
    this.zoom = zoom()
      .scaleExtent(scale)
      .on('zoom', this.onZoom.bind(this));
    this.svg.call(this.zoom);
    this.svg.on('dblclick.zoom', null);
    //  this.options.scaleBar ? this.addScaleBar() : null;
    //  this.options.scaleBar && this.addScaleBar();
    return this;
  };
  Force.prototype.onZoom = function () {
    var e = event.transform;
    if (this.isSafari && this.options.isRotate90) {
      this.chartGroup
        .attr('transform', "translate(" + e.y + ", " + -e.x + ") scale(" + e.k + ")");
    } else {
      this.chartGroup
        .attr('transform', event.transform);
    }
    var range = document.getElementById('scale');
    if (range) {
      range.value = event.transform.k;
    }
  };
  Force.prototype.centerVertex = function (id) {
    var centerV = this.vertexes.find(function (v) {
      return v._id === id;
    });
    if (centerV) {
      var shiftX = window.innerWidth / 2 - centerV.x;
      var shiftY = window.innerHeight / 2 - centerV.y;
      var t = zoomIdentity.translate(shiftX, shiftY).scale(1);
      this.svg.call(this.zoom.transform, t);
    }
  };
  Force.prototype.addScaleBar = function () {
    var scaleExtent = this.options.scaleExtent;
    var scaleBar = Object.assign({}, {
      right: '5%',
      top: '',
      bottom: '5%',
      left: '',
      type: 'v',
      step: 0.5
    }, this.options.scaleBar);
    var bottom = scaleBar.bottom, top = scaleBar.top, left = scaleBar.left, right = scaleBar.right,
      type = scaleBar.type;
    var str = "<span id=\"reduce\">-</span>\n              <input type=\"range\" id=\"scale\" name=\"scaleRange\"\n                      min=\"" + scaleExtent[0] + "\" max=\"" + scaleExtent[1] + "\" value=\"1\" step=\"any\">\n              <span id=\"enlarge\">+</span>";
    var chartScale = select('#chart').style('position', 'relative')
      .append('div')
      .html(str)
      .style('position', 'absolute')
      .style('bottom', "" + bottom)
      .style('right', "" + right)
      .style('top', "" + top)
      .style('left', "" + left);
    chartScale.selectAll('span')
      .style('vertical-align', 'middle')
      .style('display', 'inline-block')
      .style('width', '16px')
      .style('height', '16px')
      .style('color', '#fff')
      .style('background-color', '#C3CACF')
      .style('text-align', 'center')
      .style('line-height', '12px')
      .style('cursor', 'pointer');
    chartScale.select('#scale')
      .style('vertical-align', 'middle')
      .style('height', '16px');
    if (type === 'v') {
      chartScale.selectAll('span')
        .style('transform', 'rotate(90deg)');
      chartScale
        .style('transform', 'rotate(-90deg)');
    }
    this.bindRangeEvent();
  };
  Force.prototype.bindRangeEvent = function () {
    var _this = this;
    var range = document.getElementById('scale');
    var enlarge = document.getElementById('enlarge');
    var reduce = document.getElementById('reduce');
    var value = 1;
    var _a = this.options.scaleBar.step, step = _a === void 0 ? 0.5 : _a;
    range.addEventListener('change', function (e) {
      if (value === e.target.value)
        return; //防止重复触发
      value = e.target.value; //记录当前值
      _this.svg.call(_this.zoom.scaleTo, value);
    });
    // 鼠标操作相关事件处理
    range.addEventListener("mousedown", function () {
      document.addEventListener("mouseup", mouseup);
      range.addEventListener("mousemove", mousemove);
    });

    function mouseup() {
      document.removeEventListener("mouseup", mouseup);
      range.removeEventListener("mousemove", mousemove);
    }

    function mousemove() {
      //主动触发Change事件
      var e = document.createEvent("Event");
      e.initEvent("change", false, true);
      range.dispatchEvent(e);
    }

    reduce.addEventListener('click', function () {
      range.value -= step;
      var e = document.createEvent("Event");
      e.initEvent("change", false, true);
      range.dispatchEvent(e);
    });
    enlarge.addEventListener('click', function () {
      range.value = +range.value + step;
      var e = document.createEvent("Event");
      e.initEvent("change", false, true);
      range.dispatchEvent(e);
    });
  };
  Force.prototype.bindClickEvents = function () {
    this.nodeEnter.on('click', this.onVertexClick.bind(this));
    this.linkEnter.on('click', this.onEdgeClick.bind(this));
    this.svg.on('click', this.onSvgClick.bind(this));
    return this;
  };
  Force.prototype.onVertexClick = function (d) {
    this.curNodeId = d._id;
    var _a = this.getHighlightIds(d), vertexIds = _a.vertexIds, edgeIds = _a.edgeIds;
    this.highlightVertex(vertexIds)
      .highlightEdge(edgeIds)
      .resetStyle();
  };
  Force.prototype.onEdgeClick = function (d) {
  };
  Force.prototype.onSvgClick = function () {
    if (event.target.tagName.toLowerCase() !== 'svg') {
      return;
    }
    this.vertexes.forEach(function (v) {
      v.state = 'normal';
    });
    this.edges.forEach(function (e) {
      e.state = 'normal';
    });
    this.curNodeId = '';
    this.svg.selectAll('.vertex')
      .each(function (d, i, g) {
        select(g[i]).attr('data-state', null);
      });
    this.resetStyle();
  };
  Force.prototype.bindHoverEvents = function () {
    this.nodeEnter.on('mouseenter', this.onVertexHover.bind(this));
    this.nodeEnter.on('mouseleave', this.onVertexHoverout.bind(this));
    this.linkEnter.on('mouseenter', this.onEdgeHover.bind(this));
    this.linkEnter.on('mouseleave', this.onEdgeHoverout.bind(this));
    return this;
  };
  Force.prototype.onVertexHover = function (d) {
  };
  Force.prototype.onVertexHoverout = function (d) {
  };
  Force.prototype.onEdgeHover = function (d) {
  };
  Force.prototype.onEdgeHoverout = function (d) {
  };
  Force.prototype.getHighlightIds = function (d) {
    return this.getLinkedVertexesAndEdges(d);
  };
  Force.prototype.bindContextmenuEvents = function () {
    this.nodeEnter.on('contextmenu', this.onVertexContextmenu.bind(this));
    return this;
  };
  Force.prototype.onVertexContextmenu = function (d) {
    return this;
  };
  Force.prototype.highlightVertex = function (ids) {
    this.nodeEnter.selectAll('.vertex .vertex-path')
      .each(function (d, i, g) {
        if (ids.includes(d._id)) {
          d.state = 'highlight';
        } else {
          d.state = 'grey';
        }
      });
    this.svg.selectAll('.vertex')
      .each(function (d, i, g) {
        select(g[i]).attr('data-state', d.state);
      });
    return this;
  };
  Force.prototype.highlightEdge = function (ids) {
    this.linkEnter.selectAll('.edge-path')
      .each(function (d, i, g) {
        if (ids.includes(d._id)) {
          d.state = 'highlight';
        } else {
          d.state = 'grey';
        }
      });
    return this;
  };
  // 通过用户自定义的方法重置所有样式
  Force.prototype.resetStyle = function () {
    var _this = this;
    // 顶点
    this.nodeEnter.selectAll('.vertex-path')
      .attr('d', function (d) {
        var type = _this.getShape(d);
        type = 'symbol' + type[0].toUpperCase() + type.slice(1);
        var size = _this.getRadius(d) * _this.getRadius(d) * Math.PI;
        var _d3 = d3; // 直接使用 d3[type] 报错
        return _this.symbol.size(size).type(_d3[type])();
      })
      .attr('fill', function (d) {
        return _this.getVertexColor(d);
      });
    this.nodeEnter.selectAll('image')
      .attr('xlink:href', function (d) {
        return _this.getIcon(d);
      });
    this.nodeEnter.selectAll('text.vertex-name')
      .attr('y', function (d) {
        return _this.getRadius(d) + 5;
      })
      .style('fill', function (d) {
        return _this.getVertexNameColor(d);
      })
      .each(this.setVertexNamePos.bind(this));
    this.nodeEnter.selectAll('.current-vertex-path').remove();
    this.addCurNodePath();
    // 边
    this.linkEnter.selectAll('.edge-path')
      .attr('stroke', function (d) {
        return _this.getEdgeColor(d);
      })
      .attr('stroke-width', function (d) {
        return _this.getEdgeWidth(d);
      });
    // 箭头
    this.setArrowStyle();
    // 边文字
    this.linkEnter.selectAll('.edge-label textPath')
      .attr('fill', function (d) {
        return _this.getEdgeLableColor(d);
      });
    this.svg.style('background', this.getBgColor());
  };
  // 改变主题
  Force.prototype.changeTheme = function (theme) {
    this.theme = theme;
    this.resetStyle();
    return this;
  };
  Force.prototype.getBgColor = function () {
    switch (this.theme) {
      case 'light':
        return '#fff';
      case 'dark':
        return '#252A39';
      default:
        return '#fff';
    }
  };
  // 获取所有与当前顶点有关联的边和顶点
  // 包含当前顶点的所有边和边连接的所有顶点
  Force.prototype.getLinkedVertexesAndEdges = function (d) {
    var vertexIds = new Set();
    var edgeIds = new Set();
    vertexIds.add(d._id);
    this.edges.forEach(function (e) {
      if (e._from === d._id || e._to === d._id) {
        vertexIds.add(e._to);
        vertexIds.add(e._from);
        edgeIds.add(e._id);
      }
    });
    return {
      vertexIds: Array.from(vertexIds),
      edgeIds: Array.from(edgeIds)
    };
  };
  // 获取最短路径上的所有顶点和边
  Force.prototype.shortestPath = function (source, target) {
    var _a = this, adjList = _a.adjList, vertexesMap = _a.vertexesMap;
    var from = vertexesMap.indexOf(source._id);
    var to = vertexesMap.indexOf(target._id);
    var vertexIds = [];
    var edgeIds = [];
    this.bfs(from);
    var path = this.pathTo(from, to);
    if (path.length <= 1) {
      return {
        vertexIds: [target._id],
        edgeIds: []
      };
    }
    path.forEach(function (v, i) {
      vertexIds.push(vertexesMap[v]);
      if (i > 0) {
        edgeIds.push(adjList[v][path[i - 1]][0]); // 如果两点之间存在多条边，返回的是第一条边
      }
    });
    return {
      vertexIds: vertexIds,
      edgeIds: edgeIds
    };
  };
  // 广度遍历
  Force.prototype.bfs = function (vertexNum) {
    var _this = this;
    for (var i in this.vertexesMap) {
      this.marker[i] = false;
    }
    var a = function (v) {
      _this.marker[v] = true;
      var queue = [];
      queue.push(v);
      var _loop_1 = function () {
        var item = queue.shift();
        if (!_this.adjList[item]) {
          return "continue";
        }
        Object.keys(_this.adjList[item]).forEach(function (k) {
          var i = +k;
          if (!_this.marker[i]) {
            _this.edgeTo[i] = item;
            queue.push(i);
            _this.marker[i] = true;
          }
        });
      };
      while (queue.length > 0) {
        _loop_1();
      }
    };
    a(vertexNum);
  };
  // 最短路径
  Force.prototype.pathTo = function (from, to) {
    var path = [];
    while (to !== from && this.edgeTo[to] !== undefined) {
      path.push(to);
      to = this.edgeTo[to];
    }
    path.push(from);
    return path;
  };
  // 过滤数据
  Force.prototype.filterVertex = function (ids) {
    this.vertexes = JSON.parse(JSON.stringify(this.options.data.vertexes.filter(function (v) {
      return !ids.includes(v._id);
    })));
    return this;
  };
  Force.prototype.filterEdge = function (ids) {
    this.edges = JSON.parse(JSON.stringify(this.options.data.edges.filter(function (v) {
      return !ids.includes(v._id);
    })));
    return this;
  };
  return Force;
}(BaseGraph));

var Tree = /** @class */ (function (_super) {
  __extends(Tree, _super);

  function Tree(options) {
    var _this = _super.call(this) || this;
    _this.defaultOptions = {
      width: 800,
      height: 800,
      diameter: 600,
      duration: 250,
      r: 10,
      collapseAll: true,
      dontCollapseList: [''],
      pathLength: 120,
      rotateLabelThreshold: 10,
      isRotate90: false,
      transform: {k: 1}
    };
    _this.options = Object.assign({}, _this.defaultOptions, options);
    _this.isSafari = Utils.isSafari();
    if (_this.options.isRotate90) {
      var tmp = _this.options.width;
      _this.options.width = _this.options.height;
      _this.options.height = tmp;
    }
    _this.lastTransform = null;
    return _this;
  }

  Tree.prototype.init = function () {
    this.preprocess()
      .draw()
      .bindEvents()
      .initPosition(this.options.transform);
  };
  Tree.prototype.preprocess = function () {
    this.preprocessData()
      .preprocessChart();
    return this;
  };
  Tree.prototype.preprocessData = function () {
    var _a = this.options, data = _a.data, diameter = _a.diameter;
    this.tree = tree()
      .size([2 * Math.PI, diameter / 2])
      .separation(function (a, b) {
        return (a.parent === b.parent ? 1 : 2) / a.depth;
      });
    this.hierarchy = hierarchy(data).each(function (d) {
      d.id = (d.parent && d.parent.data.properties._key) + d.data.properties._key;
    });
    this.root = this.tree(this.hierarchy);
    return this;
  };
  Tree.prototype.preprocessChart = function () {
    var el = this.options.el;
    select(el).selectAll('*').remove();
    this.svg = select(el).append('svg');
    this.svg.attr('width', this.options.width)
      .attr('height', this.options.height)
    /*  .style('position', 'absolute');*/
    this.chartGroup = this.svg.append('g')
      .classed('tree', true);
    this.chartGroup.append('g')
      .classed('links', true);
    this.chartGroup.append('g')
      .classed('nodes', true);
    this.chartGroup.append('defs');
    return this;
  };
  Tree.prototype.draw = function () {
    this.addNodes().addLinks();
    return this;
  };
  Tree.prototype.addNodes = function () {
    var _this = this;
    this.root = this.tree(this.hierarchy);
    var node = this.svg.select('.nodes').selectAll('.node')
      .data(this.root.descendants(), function (d) {
        return d.id;
      });
    var _a = this.options, pathLength = _a.pathLength, r = _a.r;
    this.root.descendants().forEach(function (d) {
      if (d.depth >= 2) {
        d.y = d.depth * (d.depth / 2) * pathLength;
      } else {
        d.y = d.depth * pathLength;
      }
    });
    node.transition()
      .duration(this.options.duration)
      .attr('transform', function (d) {
        return "translate(" + _this.radialPoint(d.x, d.y) + ")";
      });
    var nodeEnter = node.enter().append('g')
      .attr('class', function (d) {
        return "node " + (d.children ? 'node-internal' : 'node-leaf');
      })
      .attr('transform', function (d) {
        return "translate(" + _this.radialPoint(d.x, d.y) + ")";
      })
      .attr('stroke-width', function (d) {
        return d.depth === 0 || d.depth === 1 ? '5px' : 0;
      });
    this.addCircle(nodeEnter);
    nodeEnter.append('rect')
      .attr('width', function (d) {
        return (d.children || d._children) && d.depth != 0 ? r : 0;
      })
      .attr('height', Math.floor(r / 4))
      .attr('fill', '#fff')
      .attr('x', -r / 2)
      .attr('y', -Math.floor(r / 4) / 2);
    nodeEnter.append('rect')
      .attr('height', function (d) {
        return d._children && d.depth != 0 ? r : 0;
      })
      .attr('width', Math.floor(r / 4))
      .attr('fill', '#fff')
      .attr('y', -r / 2)
      .attr('x', -Math.floor(r / 4) / 2);
    this.chartGroup.selectAll('.text.node-name').remove();
    this.chartGroup.selectAll('.node').append('text')
      .attr('class', 'node-name')
      .call(this.formatNodeName.bind(this));
    node.exit().remove();
    return this;
  };
  Tree.prototype.radialPoint = function (x, y) {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
  };
  Tree.prototype.addCircle = function (nodeEnter) {
    nodeEnter.append('circle')
      .attr('r', this.options.r)
      .attr('fill', this.getCircleColor)
      .attr('stroke', this.getCircleColor);
    return this;
  };
  Tree.prototype.getCircleColor = function (d) {
    if (d.data.color) {
      return d.data.color;
    }
    if (d.depth === 0) {
      return '#27B3F4';
    }
    var type = '';
    if (d.depth === 1) {
      type = d.data.properties.name;
    } else if (d.depth === 2) {
      type = d.parent.data.properties.name;
    }
    switch (type) {
      case '监事':
        return '#FF9647';
      case '核心高管':
        return '#8785EB';
      case '董事':
        return '#69D5B9';
      default:
        return '#63D9F3';
    }
  };
  Tree.prototype.formatNodeName = function (text, width, h) {
    var _this = this;
    var leavesCnt = this.root.descendants().length - 1;
    if (leavesCnt < this.options.rotateLabelThreshold) {
      text.each(this.nodeNameInBottom);
    } else {
      text.each(function (d, i, g) {
        if (d.depth < 2) {
          _this.nodeNameInBottom(d, i, g);
        } else {
          _this.nodeNameInRadial(d, i, g);
        }
      });
    }
  };
  Tree.prototype.nodeNameInBottom = function (d, i, g) {
    var fontSize = 12;
    var width = 0;
    var thisText = select(g[i]);
    var len = 8;
    var textStack = [];
    var name = d.data.properties.name || '';
    var shouldWrap = true;
    if (d.depth !== 0 && name && (d.children || d._children)) { // 虚拟节点
      var children = d.children || d._children;
      name = name + '(' + (d.data.children_num || children.length) + ')';
      shouldWrap = false;
    }
    var y = 25;
    var lineHeight = fontSize + 2;
    var i = 0;
    if (shouldWrap) {
      while (name.slice(0, len).length === len) {
        textStack.push({
          name: name.slice(0, len),
          dx: -width / 2,
          dy: ((i++ * lineHeight) + y)
        });
        name = name.slice(len);
      }
      textStack.push({
        name: name.slice(0),
        dx: -width / 2,
        dy: ((i * lineHeight) + y)
      });
    } else {
      textStack = [{
        name: name,
        dx: -width / 2,
        dy: ((i * lineHeight) + y)
      }];
    }
    textStack.forEach(function (v) {
      thisText.append('tspan').text(v.name)
        .attr('x', v.dx)
        .attr('y', v.dy)
        .attr('fill', '#333')
        .attr('style', 'font-size: ' + fontSize + 'px')
        .attr('text-anchor', 'middle');
    });
  };
  Tree.prototype.nodeNameInRadial = function (d, i, g) {
    var name = d.data.properties.name || '';
    var fontSize = 12;
    var thisText = select(g[i]);
    var PI = Math.PI;
    var x = 15;
    var y = 5;
    var rotateDeg = (d.x - PI / 2) / (2 * PI) * 360;
    if (rotateDeg > 90) {
      rotateDeg -= 180;
      var txtObj = Utils.measureText(name, fontSize);
      x = -x - txtObj.width;
    }
    thisText
      .attr('transform', 'rotate(' + rotateDeg + ')')
      .attr('x', x)
      .attr('y', y)
      .append('tspan')
      .text(name)
      .attr('fill', '#333')
      .attr('style', 'font-size: ' + fontSize + 'px');
  };
  Tree.prototype.addLinks = function () {
    var link = this.svg.select('.links').selectAll('.link')
      .data(this.root.links(), function (d) {
        return d.target.id;
      });
    var linkEnter = link.enter().append('g')
      .attr('class', 'link');
    linkEnter.append('path')
      .transition()
      .duration(this.options.duration)
      .attr('d', linkRadial().angle(function (d) {
        return d.x;
      }).radius(function (d) {
        return d.y;
      }))
      .attr('fill', 'none')
      .attr('stroke', this.getLinkColor);
    link.exit().remove();
    return this;
  };
  Tree.prototype.getLinkColor = function (d) {
    return '#eee';
  };
  Tree.prototype.bindEvents = function () {
    this.zoomListener = zoom().scaleExtent([0.1, 5]).on('zoom', this.onZoom.bind(this));
    this.svg.selectAll('.node').on('click', this.onClick.bind(this));
    this.svg.call(this.zoomListener);
    return this;
  };
  Tree.prototype.onZoom = function () {
    var e = event.transform;
    if (this.isSafari && this.options.isRotate90) {
      this.chartGroup.attr('transform', "translate(" + e.y + ", " + -e.x + ") scale(" + e.k + ")");
    } else {
      this.chartGroup.attr('transform', "translate(" + e.x + ", " + e.y + ") scale(" + e.k + ")");
    }
    this.lastTransform = e;
  };
  Tree.prototype.onClick = function (d, i, g) {
    event.preventDefault();
    if (d.depth === 0) {
      return;
    }
    select(g[i]).remove();
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.preprocessChart().draw().bindEvents().initPosition(this.lastTransform);
  };
  Tree.prototype.initPosition = function (config) {
    var xShift = this.svg.attr('width') / 2;
    var yShift = this.svg.attr('height') / 2;
    if (this.isSafari && this.options.isRotate90) {
      var tmp = xShift;
      xShift = -yShift;
      yShift = tmp;
    }
    config = Object.assign({}, {
      x: xShift,
      y: yShift,
      k: 1
    }, config);
    var t = zoomIdentity.translate(config.x, config.y).scale(config.k);
    this.svg.call(this.zoomListener.transform, t);
  };
  return Tree;
}(BaseGraph));

var Bubble = /** @class */ (function (_super) {
  __extends(Bubble, _super);

  function Bubble(options) {
    var _this = _super.call(this) || this;
    _this.defaultOptions = {
      width: 800,
      height: 800,
      isRotate90: false
    };
    _this.options = Object.assign({}, _this.defaultOptions, options);
    _this.isSafari = Utils.isSafari();
    if (_this.options.isRotate90) {
      var tmp = _this.options.width;
      _this.options.width = _this.options.height;
      _this.options.height = tmp;
    }
    return _this;
  }

  Bubble.prototype.init = function () {
    this.preprocess().draw().bindEvents();
  };
  Bubble.prototype.preprocess = function () {
    this.preprocessChart().preprocesData();
    return this;
  };
  Bubble.prototype.preprocessChart = function () {
    var el = this.options.el;
    select(el).selectAll('*').remove();
    this.svg = select(el).append('svg');
    this.svg.attr('width', this.options.width)
      .attr('height', this.options.height)
      .style('position', 'absolute');
    this.chartGroup = this.svg.append('g')
      .classed('bubble', true);
    return this;
  };
  Bubble.prototype.preprocesData = function () {
    var _a = this.options, width = _a.width, height = _a.height;
    this.pack = pack()
      .size([width, height])
      .padding(3);
    this.root = hierarchy(this.options.data)
      .sum(function (d) {
        return d.pageRank;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      })
      .each(function (d) {
        var id;
        if (id = d.data._id) {
          d.class = (id.indexOf('/') > -1 && id.split('/')[0].toLowerCase());
        }
      });
    return this;
  };
  Bubble.prototype.draw = function () {
    var node = this.chartGroup.selectAll(".node")
      .data(this.pack(this.root).leaves())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    var radius = [];
    node.append("circle")
      .attr("r", function (d) {
        radius.push(d.r);
        return d.r;
      })
      .attr("id", function (d) {
        return d.data._id;
      })
      .attr("class", function (d) {
        return d.class;
      })
      .attr('name', function (d) {
        return d.data.name;
      })
      .attr('fill', this.getCircleColor);
    node.append("clipPath")
      .attr("id", function (d) {
        return "clip-" + d.data._id;
      })
      .append("use")
      .attr("xlink:href", function (d) {
        return "#" + d.data._id;
      });
    node.append("text")
      .attr('class', 'node-name')
      .call(this.formatNodeName.bind(this))
      .attr("clip-path", function (d) {
        return "url(#clip-" + d.data._id + ")";
      })
      .selectAll("tspan")
      .data(function (d) {
        if (d.data.name) {
          return d.data.name.split(/(?=[A-Z][^A-Z])/g);
        }
        return '';
      })
      .enter();
    node.append("title")
      .text(function (d) {
        return d.data.name + "\n" + Number(d.data.pageRank).toFixed(4);
      });
    return this;
  };
  Bubble.prototype.getCircleColor = function (d) {
    if (d.data._id && d.data._id.includes('Person')) {
      return '#98cb6a';
    } else {
      return '#60a1f1';
    }
  };
  Bubble.prototype.formatNodeName = function (d) {
    var _this = this;
    d.each(function (value, idx, g) {
      var radius = value.r;
      var thisText = select(g[idx]);
      var fontSize = 6;
      if (radius > 40) {
        fontSize = 16;
      } else if (radius > 20) {
        fontSize = 8;
      } else if (radius > 12) {
        fontSize = 6;
      }
      value.calcRes = {
        fontSize: fontSize,
        radius: radius
      };
      _this.setNodeNamePos(radius, fontSize, value, thisText);
    });
  };
  Bubble.prototype.setNodeNamePos = function (radius, fontSize, value, thisText) {
    var n = Math.floor(Math.sqrt(2) * radius / fontSize) || 1; // 每一行的字数, 也是行数, 呈正方形
    var name = value.data.name || '';
    var dY = name.length > n ? -fontSize : fontSize / 2;
    var textStack = [];
    var lineHeight = fontSize + 2;
    // 当n=0的时候，无限循环,因此n最小为1
    while (name.slice(0, n).length === n) {
      if (n !== 1 && textStack.length === n - 1) {
        name = name.slice(0, n - 3) + '...';
      }
      textStack.push({
        name: name.slice(0, n),
        dx: 0,
        dy: dY
      });
      dY += lineHeight;
      name = name.slice(n);
    }
    textStack.push({
      name: name,
      dx: 0,
      dy: dY
    });
    thisText.selectAll('*').remove();
    textStack.forEach(function (v) {
      thisText.append('tspan')
        .text(v.name)
        .attr('y', v.dy)
        .attr('x', v.dx)
        .attr('fill', '#fff')
        .attr('style', 'font-size: ' + fontSize + 'px')
        .attr('text-anchor', 'middle');
    });
  };
  Bubble.prototype.bindEvents = function () {
    this.bindZoom();
    return this;
  };
  Bubble.prototype.bindZoom = function () {
    function zoom$1() {
      var e = event.transform;
      if (this.isSafari && this.options.isRotate90) {
        select('g.bubble').attr('transform', "translate(" + e.y + ", " + -e.x + ") scale(" + e.k + ")");
      } else {
        select('g.bubble').attr('transform', "translate(" + e.x + ", " + e.y + ") scale(" + e.k + ")");
      }
    }

    this.zoomListener = zoom().scaleExtent([0.1, 5]).on('zoom', zoom$1.bind(this));
    this.svg.call(this.zoomListener);
  };
  return Bubble;
}(BaseGraph));

var Structure = /** @class */ (function (_super) {
  __extends(Structure, _super);

  function Structure(options) {
    var _this = _super.call(this) || this;
    _this.defaultOptions = {
      H: 66,
      rootH: 30,
      W: 72,
      rootW: 100,
      levelHeight: 110,
      width: 1500,
      height: 1000,
      duration: 0,
      isToggle: true,
      isRotate90: false,
      transform: {k: 1}
    };
    _this.options = Object.assign({}, _this.defaultOptions, options);
    _this.isSafari = Utils.isSafari();
    if (_this.options.isRotate90) {
      var tmp = _this.options.width;
      _this.options.width = _this.options.height;
      _this.options.height = tmp;
    }
    return _this;
  }

  Structure.prototype.init = function () {
    this.preprocess()
      .draw()
      .bindEvents()
      .initPosition(this.options.transform);
  };
  Structure.prototype.preprocess = function () {
    this.preprocessData()
      .preprocessChart();
    return this;
  };
  Structure.prototype.preprocessData = function () {
    var _a = this.options, W = _a.W, levelHeight = _a.levelHeight, data = _a.data;
    this.tree = tree()
      .nodeSize([W + 10, levelHeight])
      .separation(function (a, b) {
        return 1;
      });
    this.root = hierarchy(data);
    this.root.x0 = levelHeight / 2;
    this.root.y0 = 0;
    this.treeHeight = levelHeight * this.root.height;
    this.tree(this.root);
    var depthIndexMap = {};
    this.root.eachBefore(function (node) {
      var tmp = node.x;
      node.x = node.y;
      node.y = tmp;
      node.box = Utils.measureText(node.data.properties.name, 12);
      depthIndexMap[node.depth] = depthIndexMap[node.depth] ? depthIndexMap[node.depth] + 1 : 1;
      node.index = depthIndexMap[node.depth];
      if (node.parent) {
        node.id = node.parent.id + node.data.properties._key;
      } else {
        node.id = node.data.properties._key;
      }
    });
    return this;
  };
  Structure.prototype.preprocessChart = function () {
    var el = this.options.el;
    select(el).selectAll('*').remove();
    this.svg = select(el).append('svg');
    this.svg.attr('width', this.options.width)
      .attr('height', this.options.height)
    /*  .style('position', 'absolute');*/
    this.chartGroup = this.svg.append('g')
      .classed('structure', true);
    this.chartGroup.append('g')
      .classed('links', true);
    this.chartGroup.append('g')
      .classed('nodes', true);
    this.chartGroup.append('defs');
    return this;
  };
  Structure.prototype.draw = function (source) {
    if (source === void 0) {
      source = null;
    }
    source = source || this.root;
    this.addArrows()
      .addLinks(source)
      .addNodes(source);
    return this;
  };
  Structure.prototype.addArrows = function () {
    var arrowMarker = this.chartGroup.selectAll('defs').append("marker")
      .attr("id", "arrow") // 重点是这个引用，使用的时候引用这个id就行
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("viewBox", "0 0 12 12")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("orient", "auto");
    var arrow_path = "M6,2 L6,10 L2,6 L6,2";
    arrowMarker.append("path")
      .attr("d", arrow_path)
      .attr("fill", "#e3e3e3");
    return this;
  };
  Structure.prototype.addNodes = function (source) {
    var nodes = this.root.descendants();
    var _a = this.options, W = _a.W, H = _a.H, rootH = _a.rootH, isToggle = _a.isToggle;
    var node = this.chartGroup.select('.nodes').selectAll(".node")
      .data(nodes, function (d) {
        return d.id;
      });
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
    var nodeEnter = node.enter().append("g")
      .attr("class", 'node')
      .attr("transform", function (d) {
        return "translate(" + source.y0 + ", " + source.x0 + ")";
      });
    // 矩形
    var rectGroup = nodeEnter.append('g');
    rectGroup.append("rect")
      .attr("width", function (d) {
        if (d.parent) {
          return W;
        } else {
          return d.box.width + 6;
        }
      })
      .attr("height", function (d) {
        if (d.parent) {
          return H;
        } else {
          return rootH;
        }
      })
      .attr("fill", "#fff")
      .attr("stroke", "#E3E3E3")
      .attr("x", function (d) {
        return d.parent ? -W / 2 : -(d.box.width + 6) / 2;
      })
      .attr("y", function (d) {
        return d.parent ? -H / 2 : -rootH / 2 + (H - rootH) / 2;
      })
      .attr('id', function (d) {
        return d.id;
      });
    rectGroup.append("text")
      .attr("class", "node-name")
      .style('font-size', '12px');
    // 增加toggle按钮
    if (isToggle) {
      var toggleIcon = rectGroup.append('g').attr('class', 'toggle-icon')
        .style('cursor', 'pointer');
      toggleIcon.append('rect')
        .attr('width', genToggleIconSize)
        .attr('height', genToggleIconSize)
        .attr('rx', '4px')
        .attr('ry', '4px')
        .attr('fill', '#D24545')
        .attr('x', -6)
        .attr('y', H / 2 - 6);
      toggleIcon.append('text')
        .attr('x', -5)
        .attr('y', H / 2 + 3)
        .attr('fill', '#fff')
        .text(genToggleIcon);
    }
    nodeEnter.selectAll('.node-name').call(this.formatNodeName, 60, H);
    var nodeUpdate = nodeEnter.merge(node);
    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(this.options.duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });
    node.exit().remove();
    var labelText = rectGroup.append('g')
      .attr('transform', 'translate(0, -3)')
      .classed('label-text', true);
    labelText.append('rect')
      .attr('width', function (d) {
        return d.data && d.data.value ? '36px' : 0;
      })
      .attr('height', function (d) {
        return d.data && d.data.value ? '14px' : 0;
      })
      .attr('fill', '#FFF')
      .attr('x', -18)
      .attr('y', -H / 2 - 15);
    labelText.append('text')
      .attr('x', -18)
      .attr('y', -H / 2 - 3)
      .attr('fill', '#999')
      .attr('font-size', 11)
      .text(function (d) {
        return d.data && d.data.value ? d.data.value : '';
      });

    function genToggleIcon(d) {
      if (d.parent) {
        if (d.children)
          return '-';
        if (d._children)
          return '+';
      }
      return '';
    }

    function genToggleIconSize(d) {
      if (d.parent) {
        if (d.children || d._children)
          return '12px';
      }
      return 0;
    }

    return this;
  };
  Structure.prototype.formatNodeName = function (text, width, h) {

    text.each(function (d, idx, g) {
      var thisText = select(g[idx]);
      if (d.parent) {
        var len = 5;
        var textStack = [];
        var name = d.data.name || d.data.properties.name || '';
        var y = -10;
        var fontSize = 12;
        var lineHeight = 15;
        var i = 0;
        var maxLineN = Math.floor(h / lineHeight);
        while (name.slice(0, len).length === len) {
          textStack.push({
            name: name.slice(0, len),
            dx: -width / 2,
            dy: ((i++ * lineHeight) + y)
          });
          name = name.slice(len);
        }
        textStack.push({
          name: name.slice(0),
          dx: -width / 2,
          dy: ((i * lineHeight) + y)
        });
        if (textStack.length === 1) {
          var str = textStack[0];
          if (str.name.length < 2) {
            str.dx += fontSize * 2;
          } else if (str.name.length < 4) {
            str.dx += fontSize;
          }
          textStack = [str]; // 当名称长度 < 5时，用空格填充
        }
        if (textStack.length > maxLineN) {
          textStack = textStack.slice(0, maxLineN);
          var str = textStack[textStack.length - 1];
          if (str.name.length === len) {
            str.name = str.name.slice(0, len - 2) + '...';
          }
        }
        textStack.forEach(function (v) {
          thisText.append('tspan').text(v.name)
            .attr('y', v.dy)
            .attr('x', v.dx)
            .attr('fill', '#666')
            .attr('font-size', fontSize);
        });
      } else {
        thisText.append('tspan')
          .text(d.data.name || d.data.properties.name || '')
          .attr('fill', '#333')
          .attr('font-weight', 'bold')
          .attr('x', function (d) {
            return -(d.box.width) / 2;
          })
          .attr('dx', 0)
          .attr('y', h / 2 - 10)
          .attr('dy', 0);
      }
    });
  };
  Structure.prototype.addLinks = function (source) {
    source = source || this.root;
    var _a = this.options, H = _a.H, levelHeight = _a.levelHeight, duration = _a.duration;
    var link = this.chartGroup.select('.links').selectAll(".link")
      .data(this.root.descendants().slice(1), function (d) {
        return d.id;
      });
    var linkEnter = link.enter().append("path")
      .attr("class", "link")
      .attr('fill', 'none')
      .attr('stroke', '#eee')
      .attr("d", function (d) {
        if (d.id === source.id) {
          d = source;
        }
        return "M" + d.parent.y + "," + (d.parent.x + H / 2 + 6)
          + " L" + d.parent.y + "," + (d.parent.x + levelHeight / 2)
          + " L" + d.y + "," + (d.x - levelHeight / 2)
          + " L" + d.y + "," + (d.x - H / 2);
      })
      .attr("marker-start", "url(#arrow)");
    var linkUpdate = linkEnter.merge(link);
    linkUpdate.transition()
      .duration(duration)
      .attr("d", function (d) {
        return "M" + d.parent.y + "," + (d.parent.x + H / 2 + 6)
          + " L" + d.parent.y + "," + (d.parent.x + levelHeight / 2)
          + " L" + d.y + "," + (d.x - levelHeight / 2)
          + " L" + d.y + "," + (d.x - H / 2);
      });
    /** IE 强制重绘边 */
    if (/Trident/.test(navigator.userAgent)) {
      this.chartGroup.selectAll('path').remove();
      link = this.chartGroup.select('.links').selectAll(".link")
        .data(this.root.descendants().slice(1), function (d) {
          return d.id;
        });
      link.enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
          return "M" + d.parent.y + "," + (d.parent.x + H / 2 + 6)
            + " L" + d.parent.y + "," + (d.parent.x + levelHeight / 2)
            + " L" + d.y + "," + (d.x - levelHeight / 2)
            + " L" + d.y + "," + (d.x - H / 2);
        })
        .attr("marker-start", "url(#arrow)");
    }
    link.exit().remove();
    return this;
  };
  Structure.prototype.bindEvents = function () {
    this.bindZoom();
    if (this.options.isToggle) {
      this.bindToggle();
    }
    return this;
  };
  Structure.prototype.bindZoom = function () {
    function zoom$1() {
      var e = event.transform;
      if (this.isSafari && this.options.isRotate90) {
        this.chartGroup.attr('transform', "translate(" + e.y + ", " + -e.x + ") scale(" + e.k + ")");
      } else {
        this.chartGroup.attr('transform', "translate(" + e.x + ", " + e.y + ") scale(" + e.k + ")");
      }
    }

    this.zoomListener = zoom().scaleExtent([0.1, 5])
      .on('zoom', zoom$1.bind(this));
    this.svg.call(this.zoomListener);
    this.svg.on('dblclick.zoom', null);
  };
  Structure.prototype.bindToggle = function () {
    var toggleBtn = this.svg.selectAll('.toggle-icon');
    toggleBtn.on('click', toggle.bind(this));

    function toggle(d, i, g) {
      event.preventDefault();
      var t = select(g[i]).select('text');
      if (t.text() === '-') {
        d._children = d.children;
        d.children = null;
        t.text('+');
      } else {
        d.children = d._children;
        d._children = null;
        t.text('-');
      }
      this.draw(d).bindToggle();
      return false;
    }
  };
  Structure.prototype.initPosition = function (config) {
    var levelHeight = this.options.levelHeight;
    // 初始化收缩范围
    var xShift = this.svg.attr('width') / 2;
    var yShift = 0;
    if (this.treeHeight > this.svg.attr('height')) {
      yShift = (this.svg.attr('height') - levelHeight * 3) / 2;
    } else {
      yShift = (this.svg.attr('height') - this.treeHeight) / 2;
    }
    if (this.isSafari && this.options.isRotate90) {
      xShift = 0;
      yShift = this.svg.attr('width') / 2;
    }
    config = Object.assign({}, {
      x: xShift,
      y: yShift,
      k: 1
    }, config);
    var t = zoomIdentity.translate(config.x, config.y).scale(config.k);
    this.svg.call(this.zoomListener.transform, t);
    return this;
  };
  return Structure;
}(BaseGraph));

export {Utils, Force, Tree, Structure, Bubble};
